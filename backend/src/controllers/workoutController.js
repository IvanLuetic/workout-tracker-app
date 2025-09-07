import WorkoutSession from "../models/WorkoutSession.js";
import TemplateExercises from "../models/TemplateExercises.js";
import WorkoutTemplate from "../models/WorkoutTemplate.js";
import SessionExercises from "../models/SessionExercises.js";
import SessionSets from "../models/SessionSets.js";
import CustomError from "../utils/customError.js";
import sequelize from "../../db/connect.js";

export const handleResponse = async (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    status: "success",
    message: message,
    data: data,
  });
};

export const createWorkoutTemplate = async (req, res, next) => {
  const userId = req.user.userGuid;
  const templateName = req.body.templateName;
  if (!req.body.exercises)
    return next(new CustomError("Exercises are required", 400));

  const result = await WorkoutTemplate.create({
    userGuid: userId,
    name: templateName,
  });
  const templateId = result.dataValues.templateGuid;
  const exercises = req.body.exercises;
  console.log(exercises);

  await exercises.forEach((exercise) => {
    TemplateExercises.create({
      templateGuid: templateId,
      name: exercise.name,
      exercise_order: exercise.order,
    });
  });
  handleResponse(res, 200, "Template created");
};

export const deleteWorkoutTemplate = async (req, res, next) => {
  const userId = req.user.userGuid;
  const templateName = req.body.templateName;
  await TemplateExercises.destroy({
    where: { userGuid: userId, name: templateName },
  });
  handleResponse(res, 200, "Template deleted");
};

export const getAllWorkoutTemplates = async (req, res, next) => {
  const userId = req.user.userGuid;
  const result = await WorkoutTemplate.findAll({
    where: { userGuid: userId },
    include: [
      {
        model: TemplateExercises,
        order: [["exercise_order", "DESC"]],
      },
    ],
  });
  const templates = result.map((template) => template.get({ plain: true }));

  handleResponse(res, 200, "Templates sent", templates);
};

export const getWorkoutSessions = async (req, res, next) => {
  const userId = req.user.userGuid;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const offset = (page - 1) * limit;

  const whereQuery = { userGuid: userId };
  if (req.query.templateName) whereQuery.templateName = req.query.templateName;

  const { count, rows } = await WorkoutSession.findAndCountAll({
    where: whereQuery,
    include: [
      {
        model: SessionExercises,
        include: [{ model: SessionSets }],
      },
    ],
    order: [
      ["date", "DESC"],

      [SessionExercises, "exercise_number", "ASC"],

      [SessionExercises, SessionSets, "set_number", "ASC"],
    ],
    limit,
    offset,
    distinct: true,
  });
  const sessions = rows.map((session) => session.get({ plain: true }));

  const response = {
    sessions: sessions,
    total: count,
    page,
    totalPages: Math.ceil(count / limit),
  };

  handleResponse(res, 200, "Sessions sent", response);
};

export const createWorkoutSession = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.userGuid;
    const { session, exercises } = req.body;

    let templateDB = null;

    if (session.templateName) {
      templateDB = await WorkoutTemplate.findOne({
        where: {
          name: session.templateName,
          userGuid: userId,
        },
        transaction,
      });
    }

    const sessionDB = await WorkoutSession.create(
      {
        userGuid: userId,
        date: session.date,
        notes: session.notes || null,
        templateName: session.templateName || "Untitled",
        templateGuid: templateDB?.dataValues.templateGuid || null,
      },
      { transaction }
    );

    for (const exercise of exercises) {
      const result1 = await SessionExercises.create(
        {
          sessionGuid: sessionDB.dataValues.sessionGuid,
          name: exercise.name,
          exercise_number: exercise.exercise_order,
        },
        { transaction }
      );

      for (const set of exercise.sets) {
        await SessionSets.create(
          {
            sessionExerciseGuid: result1.dataValues.exerciseGuid,
            weight: set.weight,
            reps: set.reps,
            rir: set.rir,
            set_number: set.set_number,
            notes: set.notes || null,
          },
          { transaction }
        );
      }
    }
    await transaction.commit();

    handleResponse(res, 200, "Session logged");
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

export const deleteSession = async (req, res, next) => {
  const sessionId = req.params.id;
  await WorkoutSession.destroy({
    where: { sessionGuid: sessionId },
  });
  handleResponse(res, 200, "Session deleted");
};

import WorkoutSession from "../models/WorkoutSession.js";
import TemplateExercises from "../models/TemplateExercises.js";
import WorkoutTemplate from "../models/WorkoutTemplate.js";
import SessionExercises from "../models/SessionExercises.js";
import SessionSets from "../models/SessionSets.js";
import { ForeignKeyConstraintError, where } from "sequelize";
import CustomError from "../utils/customError.js";

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
  const result = await WorkoutSession.findAll({
    where: { userGuid: userId },

    include: [
      {
        model: SessionExercises,
        include: [{ model: SessionSets }],
      },
    ],
    order: [["date", "DESC"]],
  });

  const sessions = result.map((session) => session.get({ plain: true }));
  /*   let i = 0;

  result.dataValues.forEach(async (session) => {
    sessions[i].name = result.dataValues.name;
    sessions[i].date = result.dataValues.date;
    sessions[i].notes = result.dataValues.notes;
    const sessionGuid = result.dataValues.sessionGuid;
    const result1 = await SessionExercises.findAll({
      where: { sessionGuid: sessionGuid },
    });
    sessions[i].exercises = result.dataValues.name;
    result1.dataValues.forEach(async (exercise) => {
      const exerciseGuid = result1.dataValues.exerciseGuid;
      const result2 = await SessionSets.findAll({
        where: { exerciseGuid: exerciseGuid },
      });
    });
  }); */

  handleResponse(res, 200, "Sessions sent", sessions);
};
export const createWorkoutSession = async (req, res, next) => {
  console.log(req.body);
  const userId = req.user.userGuid;
  const { session, exercises } = req.body;

  let templateDB = null;

  if (session.templateName) {
    templateDB = await WorkoutTemplate.findOne({
      where: {
        name: session.templateName,
        userGuid: userId,
      },
    });
  }

  const sessionDB = await WorkoutSession.create({
    userGuid: userId,
    date: session.date,
    notes: session.notes || null,
    templateName: session.templateName || "Untitled",
    templateGuid: templateDB?.dataValues.templateGuid || null,
  });

  for (const exercise of exercises) {
    const result1 = await SessionExercises.create({
      sessionGuid: sessionDB.dataValues.sessionGuid,
      name: exercise.name,
      exercise_number: exercise.exercise_order,
    });
    for (const set of exercise.sets) {
      const result2 = await SessionSets.create({
        sessionExerciseGuid: result1.dataValues.exerciseGuid,
        weight: set.weight,
        reps: set.reps,
        rir: set.rir,
        notes: set.notes || null,
      });
    }
  }

  handleResponse(res, 200, "Session logged");
};

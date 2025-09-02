import express from "express";
import { protect } from "../controllers/authController.js";
import {
  createWorkoutTemplate,
  createWorkoutSession,
  getAllWorkoutTemplates,
  getWorkoutSessions,
} from "../controllers/workoutController.js";
import { json } from "sequelize";

const router = express.Router();

router.post("/template", protect, createWorkoutTemplate);
router.post("/session", protect, createWorkoutSession);
router.get("/template", protect, getAllWorkoutTemplates);
router.get("/session", protect, getWorkoutSessions);

/* export const doc = async (req, res, next) => {
  console.log("DATA", req.file);

  res.status(200).json({
    data: {
      file: {
        ...req.file,
        id: 5
      },
    },
  });
};
router.post("/document/sign", doc); */

/* router.post("/addExercise");
router.patch("/template");
router.get("/template/:id");
router.post("/session"); */

export default router;

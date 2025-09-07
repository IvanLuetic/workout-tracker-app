import express from "express";
import { protect } from "../controllers/authController.js";
import {
  createWorkoutTemplate,
  createWorkoutSession,
  getAllWorkoutTemplates,
  getWorkoutSessions,
  deleteSession,
} from "../controllers/workoutController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Workout
 */

/**
 * @swagger
 * /api/workout/template:
 *   post:
 *     summary: Create a new workout template
 *     tags: [Workout]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - templateName
 *               - exercises
 *             properties:
 *               templateName:
 *                 type: string
 *                 description: Name of the template
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     order:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Template created successfully
 *       400:
 *         description: Exercises are required
 *       401:
 *         description: Not authenticated
 */
router.post("/template", protect, createWorkoutTemplate);

/**
 * @swagger
 * /api/workout/template:
 *   get:
 *     summary: Get all workout templates for the user
 *     tags: [Workout]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of workout templates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WorkoutTemplate'
 *       401:
 *         description: Not authenticated
 */
router.get("/template", protect, getAllWorkoutTemplates);

/**
 * @swagger
 * /api/workout/session:
 *   post:
 *     summary: Create a new workout session
 *     tags: [Workout]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - session
 *               - exercises
 *             properties:
 *               session:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   notes:
 *                     type: string
 *                   templateName:
 *                     type: string
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     exercise_order:
 *                       type: integer
 *                     sets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           weight:
 *                             type: number
 *                           reps:
 *                             type: integer
 *                           rir:
 *                             type: integer
 *                           set_number:
 *                             type: integer
 *                           notes:
 *                             type: string
 *     responses:
 *       200:
 *         description: Session created successfully
 *       401:
 *         description: Not authenticated
 */
router.post("/session", protect, createWorkoutSession);

/**
 * @swagger
 * /api/workout/session:
 *   get:
 *     summary: Get workout sessions with pagination
 *     tags: [Workout]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Paginated workout sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     sessions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/WorkoutSession'
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       401:
 *         description: Not authenticated
 */
router.get("/session", protect, getWorkoutSessions);

/**
 * @swagger
 * /api/workout/session/{id}:
 *   delete:
 *     summary: Delete a workout session
 *     tags: [Workout]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Session GUID
 *     responses:
 *       200:
 *         description: Session deleted successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Session not found
 */
router.delete("/session/:id", protect, deleteSession);

export default router;

import express from "express";
import { protect, checkAdmin } from "../controllers/authController.js";
import {
  validatePasswordChange,
  validateUserSignUp,
} from "../middlewares/inputValidator.js";
import { updatePassword } from "../controllers/userController.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/authController.js";

const router = express.Router();

router.patch(
  "/updatePassword",
  protect,
  validatePasswordChange,
  updatePassword
);
//router.put('/updateMe', protect, validateUserSignUp, updateMe);
router.get("/getAllUsers", protect, getAllUsers);
router.get("/get/:id", getUserById);
router.put(
  "/update/:id",
  protect,
  checkAdmin("admin"),
  validateUserSignUp,
  updateUser
);
router.delete("/delete/:id", protect, checkAdmin("admin"), deleteUser);

export default userRouter;

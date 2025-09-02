import express from "express";
import {
  signUp,
  login,
  getMe,
  protect,
  logout,
  /*
  forgotPassword,
  resetPassword,
  protect,
  getMe, */
} from "../controllers/authController.js";
/* import {
  validateUserLogin,
  validateUserSignUp,
} from "../middlewares/inputValidator.js"; */

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", logout);
/*router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword); */

export default router;

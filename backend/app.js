import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./src/routes/authRouter.js";
import workoutRouter from "./src/routes/workoutRouter.js";
import handleError from "./src/controllers/errorController.js";
import CustomError from "./src/utils/customError.js";
import multer from "multer";

dotenv.config();

// Initialize Express app
const app = express();

// Configure Multer (memory storage for example)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Middleware setup
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/api/auth", authRouter);
app.use("/api/workout", upload.single("file"), workoutRouter);

app.all("*all", (req, res, next) => {
  const err = new CustomError(`The URL ${req.originalUrl} does not exist`, 404);
  next(err);
});

app.use(handleError);

export default app;

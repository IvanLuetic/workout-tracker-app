import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./src/routes/authRouter.js";
import workoutRouter from "./src/routes/workoutRouter.js";
import handleError from "./src/controllers/errorController.js";
import CustomError from "./src/utils/customError.js";
import swaggerUi from "swagger-ui-express";
import specs from "./swaggerConfig.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

const corsOptions = {
  origin: "http://localhost:5174",
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/auth", authRouter);
app.use("/api/workout", workoutRouter);

app.all("*all", (req, res, next) => {
  const err = new CustomError(`The URL ${req.originalUrl} does not exist`, 404);
  next(err);
});

app.use(handleError);

export default app;

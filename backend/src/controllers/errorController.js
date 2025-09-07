import CustomError from "../utils/customError.js";
import { Sequelize } from "sequelize";

const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};
const prodErrors = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "Error",
      message: "Something went wrong.",
    });
  }
};
const handleValidationError = (error) => {
  const field = error.errors[0].path;
  const type = error.errors[0].type;
  let message = null;

  if (type === "notNull Violation") {
    message = `${field} is required.`;
    return new CustomError(message, 400);
  } else if (type === "unique violation") {
    message = `${field} must be unique.`;
    return new CustomError(message, 400);
  } else {
    return new CustomError(error.errors[0].message, 400);
  }
};

const handleJWTError = (err) => {
  return new CustomError("Invalid token. Please log in again", 401);
};
const handleJWTExpiredError = (err) => {
  return new CustomError("Token expired. Please log in again", 401);
};

const handleError = async (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  console.error("ERROR:", error);
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    devErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {
    if (error.name === "SequelizeUniqueConstraintError") {
      error = handleValidationError(error);
    }
    if (error instanceof Sequelize.ValidationError) {
      error = handleValidationError(error);
    }
    if (error.name === "JsonWebTokenError") {
      error = handleJWTError(error);
    }
    if (error.name === "TokenExpiredError") {
      error = handleJWTExpiredError(error);
    }
    prodErrors(res, error);
  }
};

export default handleError;

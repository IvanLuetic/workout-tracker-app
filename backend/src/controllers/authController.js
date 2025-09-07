import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { hashPassword, checkPassword } from "../utils/authUtils.js";
import CustomError from "../utils/customError.js";
import util from "node:util";

export const createJwtToken = async (id) => {
  const token = jwt.sign({ id }, process.env.SECRET_STR, { expiresIn: "48h" });

  return token;
};

export const handleResponse = async (res, statusCode, message, user = null) => {
  const token = await createJwtToken(user.userGuid);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 100000,
    sameSite: "Strict",
  });
  res.status(statusCode).json({
    status: "success",
    message: message,
    token: token,
    data: {
      user: {
        ...user,
        password: undefined,
      },
    },
  });
};

export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = await hashPassword(password);
  const result = await User.create({
    username: username,
    email: email,
    password: hashedPassword,
  });

  return handleResponse(res, 200, "User created", result.dataValues);
};

export const login = async (req, res, next) => {
  const { username, password } = req.body;

  const result = await User.findOne({
    where: {
      username: username,
    },
  });

  if (!result) return next(new CustomError("Incorrect credentials", 401));
  if (!(await checkPassword(password, result.dataValues.password)))
    return next(new CustomError("Incorrect password", 401));

  return handleResponse(res, 200, "User logged in", result.dataValues);
};

export const protect = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token)
    return next(new CustomError("You must be logged in to do this", 403));

  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.SECRET_STR
  );

  const user = await User.findByPk(decodedToken.id);
  if (!user) return next(new CustomError("User does not exist", 400));

  req.user = user.dataValues;
  next();
};

export const checkAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Admin permissions required",
    });
  }
  next();
};

export const getMe = async (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: {
      user: {
        ...req.user,
        password: undefined,
      },
    },
  });
};

export const logout = (req, res, next) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

export const updateUser = async (req, res, next) => {
  const userGuid = req.user.userGuid;
  const updateData = {};
  const { username, email } = req.body;
  if (username) updateData.username = username;
  if (email) updateData.email = email;

  await User.update(updateData, {
    where: { userGuid: userGuid },
  });
  res.status(200).json({ message: "User updated succesfully" });
};

export const deleteUser = async (req, res, next) => {
  const userId = req.params.id;
  const userToDelete = await User.findOne({ where: { userGuid: userId } });

  if (!userToDelete) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  await User.destroy({ where: { userGuid: userId } });

  res.status(200).json({
    success: true,
    message: "User deleted successfully.",
  });
};

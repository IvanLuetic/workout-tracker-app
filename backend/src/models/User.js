import { DataTypes } from "sequelize";
import sequelize from "../../db/connect.js";

const User = sequelize.define(
  "Users",
  {
    userGuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,

      validate: {
        notEmpty: {
          msg: "Username is required",
        },
        async isUnique(value) {
          const user = await User.findOne({ where: { username: value } });
          if (user) throw new Error("Username is already taken");
        },
        len: {
          args: [3, 100],
          msg: "Username must be between 3 and 100 characters long",
        },
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Please provide a valid email address",
        },
        notEmpty: {
          msg: "Email is required",
        },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password is required",
        },
        len: {
          args: [6, 255],
          msg: "Password must be at least 6 characters long",
        },
      },
    },
    password_last_changed: {
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW,
    },
    isAdmin: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    id: false,
  }
);

export default User;

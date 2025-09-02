import { DataTypes } from "sequelize";
import sequelize from "../../db/connect.js";

const Exercises = sequelize.define(
  "Exercises",
  {
    exerciseGuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      unique: true,
    },
    muscle_group: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "exercises",
    id: false,
  }
);

export default Exercises;

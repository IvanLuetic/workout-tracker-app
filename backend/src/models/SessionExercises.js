import { DataTypes } from "sequelize";
import sequelize from "../../db/connect.js";

const SessionExercises = sequelize.define(
  "SessionExercises",
  {
    exerciseGuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sessionGuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    exercise_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    /*  notes: {
      type: DataTypes.TEXT,
    }, */
  },
  {
    timestamps: false,
    tableName: "session_exercises",
    id: false,
    indexes: [
      {
        unique: true,
        fields: ["sessionGuid", "name"],
      },
    ],
  }
);

export default SessionExercises;

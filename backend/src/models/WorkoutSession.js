import { DataTypes } from "sequelize";
import sequelize from "../../db/connect.js";

const WorkoutSession = sequelize.define(
  "WorkoutSession",
  {
    sessionGuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userGuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    templateGuid: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    templateName: {
      type: DataTypes.TEXT,
      defaultValue: "Untitled",
    },
    date: {
      type: DataTypes.DATE,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
    tableName: "workout_session",
    id: false,
  }
);

export default WorkoutSession;

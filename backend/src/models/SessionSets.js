import { DataTypes } from "sequelize";
import sequelize from "../../db/connect.js";

const SessionSets = sequelize.define(
  "SessionSets",
  {
    setGuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sessionExerciseGuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    set_number: {
      type: DataTypes.INTEGER,
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reps: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rir: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
    tableName: "session_sets",
    id: false,
  }
);

export default SessionSets;

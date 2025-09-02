import { DataTypes } from "sequelize";
import sequelize from "../../db/connect.js";

const WorkoutTemplate = sequelize.define(
  "WorkoutTemplate",
  {
    templateGuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    userGuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "workout_template",
    id: false,
    indexes: [
      {
        unique: true,
        fields: ["name", "userGuid"],
      },
    ],
  }
);

export default WorkoutTemplate;

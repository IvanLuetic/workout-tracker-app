import { DataTypes } from "sequelize";
import sequelize from "../../db/connect.js";

const TemplateExercises = sequelize.define(
  "TemplateExercises",
  {
    exerciseGuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    templateGuid: {
      type: DataTypes.UUID,
    },
    exercise_order: {
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "template_exercises",
    id: false,
    indexes: [
      {
        unique: true,
        fields: ["templateGuid", "name"],
      },
    ],
  }
);

export default TemplateExercises;

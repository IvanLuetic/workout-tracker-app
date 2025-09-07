import User from "./user.js";
import WorkoutTemplate from "./WorkoutTemplate.js";
import TemplateExercises from "./TemplateExercises.js";
import WorkoutSession from "./WorkoutSession.js";
import SessionExercises from "./SessionExercises.js";
import SessionSets from "./SessionSets.js";

User.hasMany(WorkoutTemplate, { foreignKey: "userGuid" });
User.hasMany(WorkoutSession, { foreignKey: "userGuid" });
WorkoutTemplate.belongsTo(User, { foreignKey: "userGuid" });
WorkoutTemplate.hasMany(TemplateExercises, { foreignKey: "templateGuid" });
TemplateExercises.belongsTo(WorkoutTemplate, { foreignKey: "templateGuid" });
WorkoutSession.belongsTo(User, { foreignKey: "userGuid" });
WorkoutSession.belongsTo(WorkoutTemplate, {
  foreignKey: "templateGuid",
  allowNull: true,
});
WorkoutSession.hasMany(SessionExercises, { foreignKey: "sessionGuid" });
SessionExercises.belongsTo(WorkoutSession, { foreignKey: "sessionGuid" });
SessionExercises.hasMany(SessionSets, { foreignKey: "sessionExerciseGuid" });
SessionSets.belongsTo(SessionExercises, { foreignKey: "sessionExerciseGuid" });

export {
  User,
  WorkoutSession,
  WorkoutTemplate,
  TemplateExercises,
  SessionExercises,
  SessionSets,
};

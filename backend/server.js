import app from "./app.js";
import dotenv from "dotenv";
import sequelize from "./db/connect.js";
import "./src/models/index.js";

dotenv.config();

/* process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught Exception occurred! Shutting down...");
  process.exit(1);
}); */

const port = process.env.PORT || 3001;
/* sequelize.sync({ alter: true }).then(() => {
  console.log("✅ Database synced (alter: true)");
}); */

const server = app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

/* process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection", err);

  if (process.env.NODE_ENV === "production") {
    server.close(() => process.exit(1));
  }
});
 */

import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    dialect: "postgres",
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      `Connection with ${process.env.PG_DATABASE} has been established successfully.`
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

testConnection();

export default sequelize;

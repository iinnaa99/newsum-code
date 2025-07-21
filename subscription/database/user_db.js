import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const userDb = mysql.createPool({
  host: process.env.USER_DB_HOST,
  user: process.env.USER_DB_USER,
  password: process.env.USER_DB_PASSWORD,
  database: process.env.USER_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export default userDb;

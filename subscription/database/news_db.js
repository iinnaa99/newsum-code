import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const newsDb = mysql.createPool({
  host: process.env.NEWS_DB_HOST,
  user: process.env.NEWS_DB_USER,
  password: process.env.NEWS_DB_PASSWORD,
  database: process.env.NEWS_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export default newsDb;

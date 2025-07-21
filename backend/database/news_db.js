import dotenv from "dotenv";
if (process.env.KUBERNETES_SERVICE_HOST === undefined) {
  dotenv.config({ path: ".env" });
}

import mysql from "mysql2/promise";

const news_db = await mysql.createConnection({
  host: process.env.NEWS_DB_HOST,
  user: process.env.NEWS_DB_USER,
  password: process.env.NEWS_DB_PASSWORD,
  database: process.env.NEWS_DB_NAME,
});

export default news_db;

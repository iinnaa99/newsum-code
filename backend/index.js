import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import newsRouter from "./routes/news.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ 기본 설정
app.use(cors());
app.use(express.json());
app.use("/api/news", newsRouter);
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// ✅ HTTP 서버 실행 (포트 3000)
const port = 3000;
app.listen(port, () => {
  console.log(`✅ HTTP Server running on http://localhost:${port}`);
});

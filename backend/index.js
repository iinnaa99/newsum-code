import express from "express";
import cors from "cors";
import path from "path";
import http from "http"; // ✅ 추가
import { fileURLToPath } from "url";

import newsRouter from "./routes/news.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ 기본 설정
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).send("Backend healthy");
});

app.use("/api/news", newsRouter);
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// ✅ HTTP 서버 생성 및 설정
const port = 3000;
const server = http.createServer(app);

// ✅ 커넥션 관련 설정
server.keepAliveTimeout = 60000; // 커넥션 유지 시간
server.headersTimeout = 65000; // 헤더 대기 시간
server.maxConnections = 10000; // 최대 커넥션 수

server.listen(port, "0.0.0.0", () => {
  console.log(`✅ HTTP Server running on http://0.0.0.0:${port}`);
});

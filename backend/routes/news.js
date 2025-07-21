// backend/routes/news.js
import express from "express";
import db from "../database/news_db.js";

const router = express.Router();

// 📌 GET /api/news/top10 - top10 뉴스
router.get("/top10", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        s.topic_id,
        s.topic_title,
        s.topic_content,
        s.keyword,
        s.new_cnt
      FROM news_sum s
      ORDER BY s.new_cnt DESC
      LIMIT 10;
    `);
    res.json(rows);
  } catch (error) {
    console.error("❌ Top 10 뉴스 조회 실패:", error);
    res.status(500).json({ error: "Top 뉴스 조회 중 오류 발생" });
  }
});

// 📌 GET /api/news/topic - 주제별 뉴스
router.get("/topic", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
          t.topic_id,
          t.topic_title,
          t.topic_content,
          t.keyword,
          t.new_cnt,
          n.title AS news_title,
          n.url AS news_link,
          n.company AS press_name,
          n.upload_date,
          n.thumbnail AS photo_link,
          c.subject_name AS category_name
      FROM news_sum t
      JOIN news_raw n ON t.topic_id = n.cluster2nd
      JOIN subject c ON n.subject = c.subject_id
      ORDER BY t.new_cnt DESC, n.upload_date DESC;
    `);
    res.json(rows);
  } catch (error) {
    console.error("❌ 주제별 뉴스 조회 실패:", error);
    res.status(500).json({ error: "주제별 뉴스 조회 중 오류 발생" });
  }
});

// 📌 GET /api/news/press - 언론사별 뉴스
router.get("/press", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        company AS press_name,
        title,
        url AS link,
        upload_date,
        thumbnail AS photo_link
      FROM (
        SELECT *,
              COUNT(*) OVER (PARTITION BY company) AS total_count
        FROM news_raw
      ) AS sub
      WHERE total_count >= 3
      ORDER BY total_count DESC, company, upload_date DESC;
    `);
    res.json(rows);
  } catch (error) {
    console.error("❌ 언론사별 뉴스 조회 실패:", error);
    res.status(500).json({ error: "언론사별 뉴스 조회 중 오류 발생" });
  }
});

// 📌 GET /api/news/related - topic_id로 관련 뉴스 가져오기
router.get("/related", async (req, res) => {
  const topicId = req.query.topic_id;
  if (!topicId) {
    return res.status(400).json({ error: "topic_id가 필요합니다." });
  }

  try {
    const [rows] = await db.query(
      `
      SELECT
        title AS news_title,
        url AS news_link,
        company AS press_name,
        upload_date
      FROM news_raw
      WHERE cluster2nd = ?
      ORDER BY upload_date DESC;
    `,
      [topicId]
    );

    res.json(rows);
  } catch (error) {
    console.error("❌ 관련 뉴스 조회 실패:", error);
    res.status(500).json({ error: "관련 뉴스 조회 중 오류 발생" });
  }
});

export default router;

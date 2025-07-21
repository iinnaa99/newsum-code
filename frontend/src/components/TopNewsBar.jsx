import React, { useEffect, useState, useRef } from "react";

export default function TopNewsBar({ onTitleClick }) {
  const [topNews, setTopNews] = useState([]);
  const fetchedRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  function decodeHtmlEntities(str) {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  }

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchTopNews = async () => {
      try {
        const response = await fetch(
          `${window.config.VITE_API_BACKEND}/api/news/top10`
        );

        const data = await response.json();
        setTopNews(data);
      } catch (error) {
        console.error("🔥 Top 뉴스 불러오기 실패:", error);
      }
    };

    fetchTopNews();
  }, []);

  const handleTitleClick = async (news) => {
    const keywords = news.keyword
      ? news.keyword.split(",").map((k) => k.trim())
      : [];

    try {
      // 🔁 topic_id로 관련 뉴스 요청
      const res = await fetch(
        `${window.config.VITE_API_BACKEND}/api/news/related?topic_id=${news.topic_id}`
      );
      const related = await res.json();

      const relatedNews = related
        .filter((n) => n.news_link !== news.news_link)
        .map((n) => ({
          title: n.news_title,
          link: n.news_link,
          press: n.press_name,
          upload_date: n.upload_date,
        }));

      onTitleClick?.({
        title: news.topic_title ?? "제목 없음",
        summary: news.topic_content ?? "요약 없음",
        relatedWords: keywords,
        topic_id: news.topic_id,
        relatedNews, // ✅ 누락 금지
      });
    } catch (err) {
      console.error("❌ 관련 뉴스 가져오기 실패", err);
    }
  };

  const renderList = (newsArray, startIndex) =>
    newsArray.map((news, i) => (
      <li
        key={news.id ?? i}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.5rem 1rem",
          marginBottom: "0.5rem",
          fontSize: "1.1rem",
          cursor: "pointer",
        }}
        onClick={() => handleTitleClick(news)}
      >
        <span
          style={{
            display: "inline-block",
            maxWidth: "80%",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          <strong style={{ marginRight: "0.75rem", color: "#ccc" }}>
            {startIndex + i}
          </strong>
          {decodeHtmlEntities(news.topic_title)}
        </span>
        <span
          style={{
            whiteSpace: "nowrap",
            color: "#007bff",
            fontWeight: "bold",
          }}
        >
          {news.new_cnt ?? 0}건
        </span>
      </li>
    ));

  // ✅ 중복 topic_id 제거된 뉴스만 추출
  const uniqueTopics = [];
  const seenTopics = new Set();
  topNews.forEach((news) => {
    if (!seenTopics.has(news.topic_id)) {
      uniqueTopics.push(news);
      seenTopics.add(news.topic_id);
    }
  });

  return (
    <div style={{ width: "100%", margin: "1rem" }}>
      {/* 날짜 */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: isMobile ? "0 1rem" : "0 3rem",
          color: "#444",
          fontWeight: "bold",
          fontSize: isMobile ? "13pt" : "15pt",
        }}
      >
        {(() => {
          const now = new Date();
          const date = now.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          const weekday = now.toLocaleDateString("ko-KR", {
            weekday: "short",
          });

          return `${date} (${weekday})`;
        })()}
      </div>

      {/* 뉴스 목록 */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          background: "#0a0a1a",
          color: "#fff",
          padding: "1.5rem",
          borderRadius: "1rem",
          gap: "2rem",
          margin: isMobile ? "1rem" : "0 auto",
        }}
      >
        {isMobile ? (
          <ol
            style={{ width: "100%", padding: 0, margin: 0, listStyle: "none" }}
          >
            {renderList(uniqueTopics.slice(0, 10), 1)}
          </ol>
        ) : (
          <>
            <ol
              style={{
                width: "48%",
                padding: 0,
                margin: 0,
                listStyle: "none",
              }}
            >
              {renderList(uniqueTopics.slice(0, 5), 1)}
            </ol>
            <ol
              style={{
                width: "48%",
                padding: 0,
                margin: 0,
                listStyle: "none",
              }}
            >
              {renderList(uniqueTopics.slice(5, 10), 6)}
            </ol>
          </>
        )}
      </div>

      {/* 분석 기준 날짜 */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: isMobile ? "0 1rem" : "0 3rem",
          color: "#999",
          fontSize: isMobile ? "7pt" : "11pt",
        }}
      >
        {(() => {
          const now = new Date(); // 현재 시각
          const end = new Date(now); // 끝 시점은 현재 시각
          const start = new Date(end);
          start.setDate(start.getDate() - 1); // 하루 전

          const formatDate = (date) => {
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const weekday = date.toLocaleDateString("ko-KR", {
              weekday: "short",
            });
            const hours = String(date.getHours()).padStart(2, "0");

            return `${month}월 ${day}일 (${weekday}) ${hours}:00`;
          };

          return `분석 기준 : ${formatDate(start)} ~ ${formatDate(end)}`;
        })()}
      </div>
    </div>
  );
}

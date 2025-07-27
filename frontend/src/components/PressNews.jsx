import React, { useEffect, useState } from "react";
import axios from "axios";
import PressGroupCard from "./PressGroupCard";

export default function PressNews({ onTitleClick }) {
  const [groupedNews, setGroupedNews] = useState({});
  const [page, setPage] = useState(0);
  const [groupsPerPage, setGroupsPerPage] = useState(3); // 반응형 처리

  // 🔁 반응형으로 모바일 대응
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setGroupsPerPage(2);
      } else {
        setGroupsPerPage(3);
      }
    };
    handleResize(); // 초기 실행
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTitleClick = (news) => {
    onTitleClick?.({
      title: news.news_title || "제목 없음",
      press: news.press_name ?? "언론사 미표시",
      upload_date: news.upload_date,
      link: news.news_link,
      summary: news.cont_sum ?? "요약 없음",
      relatedNews: [],
      relatedWords: [],
    });
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(
          `${window.config.VITE_API_BACKEND}/api/news/press`
        );
        const rows = res.data;

        const grouped = {};
        rows.forEach((item) => {
          const press = item.press_name || "기타 언론사";
          if (!grouped[press]) grouped[press] = [];
          grouped[press].push(item);
        });

        setGroupedNews(grouped);
      } catch (err) {
        console.error("🔥 언론사별 뉴스 API 실패:", err);
      }
    };

    fetchNews();
  }, []);

  const pressNames = Object.keys(groupedNews);
  const totalPages = Math.ceil(pressNames.length / groupsPerPage);
  const pagedPressNames = pressNames.slice(
    page * groupsPerPage,
    (page + 1) * groupsPerPage
  );

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setPage((prev) => Math.min(prev + 1, totalPages - 1));

  return (
    <div>
      <h2
        style={{
          marginBottom: "15px",
        }}
      >
        언론사별
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
          marginBottom: "1.4rem",
        }}
      >
        {pagedPressNames.map((pressName) => (
          <PressGroupCard
            key={pressName}
            pressName={pressName}
            articles={groupedNews[pressName]}
            onTitleClick={handleTitleClick}
          />
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "12px" }}>
        <button onClick={handlePrev} disabled={page === 0}>
          ⬅️
        </button>
        <span style={{ margin: "0 0 10px" }}>
          {page + 1} / {totalPages}
        </span>
        <button onClick={handleNext} disabled={page === totalPages - 1}>
          ➡️
        </button>
      </div>
    </div>
  );
}

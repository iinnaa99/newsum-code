import React from "react";
import defaultImage from "../assets/logo.png";

export default function NewsCard({
  category,
  title,
  count,
  image,
  sources,
  link,
  onTitleClick,
}) {
  function decodeHtmlEntities(str) {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
  }
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
        maxWidth: "280px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* 카테고리 뱃지 */}
      <div
        style={{
          fontSize: "0.7rem",
          color: "#555",
          background: "#eee",
          display: "inline-block",
          padding: "0.3rem 0.6rem",
          borderRadius: "999px",
          marginLeft: "1rem",
          marginTop: "1rem",
          width: "18%",
          textAlign: "center",
        }}
      >
        {category}
      </div>

      {/* 제목 + 건수 */}
      <div
        style={{
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* 제목 */}
        <h4
          onClick={() =>
            onTitleClick?.({
              title: decodeHtmlEntities(title),
              link,
              press: sources?.[0] ?? "",
              upload_date: new Date().toISOString(), // 없으면 임시로라도 전달
            })
          }
          style={{
            margin: "0.25rem 0 0 0",
            fontSize: "1rem",
            fontWeight: "bold",
            lineHeight: "1.4",
            margin: "1rem",
            cursor: "pointer",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {decodeHtmlEntities(title)}
        </h4>

        {/* 건수 - 오른쪽 정렬 */}
        <div
          style={{
            textAlign: "right",
            color: "#007bff",
            fontWeight: "bold",
            fontSize: "0.85rem",
            margin: "1rem",
          }}
        >
          {count}건
        </div>
      </div>

      {/* 이미지 */}
      <img
        src={image && image.trim() !== "" ? image : defaultImage}
        alt="뉴스 이미지"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = defaultImage;
        }}
        style={{
          width: "95%",
          height: "140px",
          objectFit: "cover",
          borderRadius: "8px",
          margin: "0.5rem",
        }}
      />

      {/* 언론사별 제목 출력 */}
      <div style={{ padding: "0.2rem" }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {sources?.slice(0, 3).map((news, i) => (
            <li key={i} style={{ marginBottom: "0.75rem" }}>
              <div style={{ margin: "1rem" }}>
                <div
                  onClick={() =>
                    onTitleClick?.({
                      title: news.news_title,
                      link: news.news_link,
                      press: news.press_name,
                      upload_date: news.upload_date,
                    })
                  }
                  style={{
                    fontSize: "0.85rem",
                    color: "#333",
                    cursor: "pointer",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {decodeHtmlEntities(news.news_title)}
                </div>
                <div
                  style={{
                    fontSize: "10pt",
                    color: "#000",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                  }}
                >
                  {news.press_name?.trim() || "뉴스1"}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 버튼 2개 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "1px solid #eee",
          marginTop: "1rem",
        }}
      >
        <button style={{ ...btnStyle, borderRadius: "0 0 0 10px" }}>
          전체 뉴스보기
        </button>
        <button style={{ ...btnStyle, borderRadius: "0 0 10px 0" }}>
          관련도 분석
        </button>
      </div>
    </div>
  );
}

const btnStyle = {
  background: "#fff",
  border: "1px solid #ddd",
  borderTop: "none",
  fontSize: "0.8rem",
  padding: "0.7rem 0",
  width: "50%",
  cursor: "pointer",
};

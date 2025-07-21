import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// 환경변수 로드
const SUBSCRIBE_API = process.env.VITE_API_SUBSCRIBE || "http://localhost:4000";
const BACKEND_API = process.env.VITE_API_BACKEND || "http://localhost:3000";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 인증 관련 API → subscription
      "/api/send-verification": {
        target: SUBSCRIBE_API,
        changeOrigin: true,
      },
      "/api/verify-email": {
        target: SUBSCRIBE_API,
        changeOrigin: true,
      },

      // 구독 API → backend
      "/api/subscribe": {
        target: BACKEND_API,
        changeOrigin: true,
      },

      // 나머지 뉴스 API → backend
      "/api": {
        target: BACKEND_API,
        changeOrigin: true,
      },
    },
  },
});

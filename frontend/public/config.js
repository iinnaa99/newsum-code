// config.js
window.config = {
  VITE_API_BACKEND:
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "http://newsum-backend.default.svc.cluster.local:3000",

  VITE_API_SUBSCRIBE:
    window.location.hostname === "localhost"
      ? "http://localhost:4000"
      : "http://newsum-subscribe.default.svc.cluster.local:4000",
};

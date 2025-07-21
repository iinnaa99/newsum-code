import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Verified from "./pages/Verified";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<Verified />} /> {/* ✅ 반드시 포함 */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

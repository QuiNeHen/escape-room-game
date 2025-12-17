// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import GameController from "./components/GameController.jsx"; // thêm .jsx nếu cần

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GameController />
  </React.StrictMode>
);
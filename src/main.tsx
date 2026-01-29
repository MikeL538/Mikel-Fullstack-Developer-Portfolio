import React from "react";
// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/main.min.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/Micha-Lipiak-Fullstack-Developer-Portfolio/">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

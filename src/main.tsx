import React from "react";
import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import "./i18n/i18n";
import "./styles/main.min.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <BrowserRouter basename="/Mikel-Fullstack-Developer-Portfolio/"> */}
    <HashRouter>
      <App />
    </HashRouter>
    {/* </BrowserRouter> */}
  </React.StrictMode>,
);

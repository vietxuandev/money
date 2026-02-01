import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./i18n/config";
import App from "./App.tsx";
import { initMobileFixes } from "./lib/mobile-fixes";

// Initialize mobile touch fixes
initMobileFixes();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

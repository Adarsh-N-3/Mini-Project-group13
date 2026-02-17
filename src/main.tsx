import { Buffer } from "buffer";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).Buffer = (window as any).Buffer || Buffer;

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App1.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

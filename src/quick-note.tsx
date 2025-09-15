import React from "react";
import ReactDOM from "react-dom/client";
import QuickNoteWindow from "./components/QuickNoteWindow";
import "./App.css";

ReactDOM.createRoot(document.getElementById("quick-note-root") as HTMLElement).render(
  <React.StrictMode>
    <QuickNoteWindow />
  </React.StrictMode>,
);

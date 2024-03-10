import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import "./index.css";
import { InfoMonthProvider } from "./context/InfoMonthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <InfoMonthProvider>
    <App />
  </InfoMonthProvider>
);

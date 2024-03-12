import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import "./index.css";
import { InfoMonthProvider } from "./context/InfoMonthContext.jsx";
import { UserProvider } from "./context/userContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <UserProvider>
    <InfoMonthProvider>
      <App />
    </InfoMonthProvider>
  </UserProvider>
);

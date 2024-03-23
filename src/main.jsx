import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import "./index.css";
import { MonthDataProvider } from "./context/MonthDataContext.jsx";
import { UserProvider } from "./context/userContext.jsx";
import { RoutineProvider } from "./context/RoutineContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <UserProvider>
    <MonthDataProvider>
      <RoutineProvider>
        <App />
      </RoutineProvider>
    </MonthDataProvider>
  </UserProvider>
);

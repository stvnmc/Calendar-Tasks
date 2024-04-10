import React from "react";
import DigitalClock from "./DigitalClock";
import { useUser } from "../context/userContext";

const NavigationBar = () => {
  const { user, logout, isAuthenticated } = useUser();

  return (
    <div className="page-top">
      {isAuthenticated && (
        <>
          <div className="logo">
            <h1>calendarRoutine</h1>
          </div>
          <DigitalClock />
          <div className="logout">
            <h2>{user}</h2>
            <button onClick={logout}>Logout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default NavigationBar;

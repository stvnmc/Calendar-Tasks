import React from "react";
import DigitalClock from "./DigitalClock";
import { useUser } from "../context/userContext";

const NavigationBar = () => {
  const { user, isAuthenticated } = useUser();

  return (
    <>
      {isAuthenticated && (
        <div className="page-top">
          <div className="logo">
            <h1>calendarRoutine</h1>
          </div>
          <DigitalClock />
          <div className="logout">
            <h2>{user}</h2>
            <button>Contact</button>
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationBar;

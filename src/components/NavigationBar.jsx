import React from "react";

import DigitalClock from "./DigitalClock";
import { useUser } from "../context/userContext";

const NavigationBar = () => {
  const { user, logout, isAuthenticated } = useUser();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <div>{user}</div>

          <div>
            <button onClick={logout}>Logout</button>
          </div>
          <a href="/">Home</a>
          <DigitalClock />
        </>
      ) : (
        ""
      )}
    </div>
  );
};
export default NavigationBar;

import React from "react";

import DigitalClock from "./DigitalClock";
import { useUser } from "../context/userContext";

const NavigationBar = () => {
  const { user } = useUser();
  console.log(user);

  return (
    <div>
      <div>{user?.email}</div>
      <a href="/">Home</a>
      <DigitalClock />
    </div>
  );
};
export default NavigationBar;

import React, { useState, useEffect } from "react";

function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const options = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return (
    <div class="digital-clock">
      <div class="linea-digital"></div>
      <div class="linea-digital-top"></div>
      <div class="linea-digital-left"></div>
      <div class="linea-digital-right"></div>
      
      <h1>{time.toLocaleTimeString([], options)}</h1>
    </div>
  );
}

export default DigitalClock;

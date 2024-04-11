import React, { useState, useEffect } from "react";

const Grid = () => {
  const initialColors = Array.from({ length: 10 }, (_, index) => {
    return index % 2 === 0 ? "rgb(211 183 181 / 20%)" : "rgb(123 108 92 / 44%)";
  });

  const [colors, setColors] = useState(initialColors);

  useEffect(() => {
    const interval = setInterval(() => {
      const newColors = colors.map((color) => {
        return color === "rgb(211 183 181 / 20%)" ? "rgb(123 108 92 / 44%)" : "rgb(211 183 181 / 20%)";
      });
      setColors(newColors);
    }, 5000);

    return () => clearInterval(interval);
  }, [colors]);

  return (
    <div className="grid">
      {colors.map((color, index) => (
        <div key={index} className="square" style={{ backgroundColor: color }}>
          <h1
            style={{
              color: color === "rgb(211 183 181 / 20%)" ? "#9e716a" : "#222d28",
            }}
          >
            {index + 1}
          </h1>
        </div>
      ))}
    </div>
  );
};

export default Grid;

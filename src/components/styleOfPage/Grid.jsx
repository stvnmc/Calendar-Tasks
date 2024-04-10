import React, { useState, useEffect } from "react";

const Grid = () => {
  const initialColors = Array.from({ length: 15 }, (_, index) => {
    return index % 2 === 0
      ? "rgba(249, 243, 243, 0.93)"
      : "rgba(73, 72, 72, 0.932)";
  });

  const [colors, setColors] = useState(initialColors);

  useEffect(() => {
    const interval = setInterval(() => {
      const newColors = colors.map((color) => {
        return color === "rgba(249, 243, 243, 0.93)"
          ? "rgba(73, 72, 72, 0.932)"
          : "rgba(249, 243, 243, 0.93)";
      });
      setColors(newColors);
    }, 5000);

    return () => clearInterval(interval);
  }, [colors]);

  return (
    <div className="grid">
      {colors.map((color, index) => (
        <div key={index} className="square" style={{ backgroundColor: color }}>
          {/* Usa un estilo condicional para cambiar el color del texto */}
          <h1 style={{ color: color === "rgba(249, 243, 243, 0.93)" ? "black" : "white" }}>
            {index}
          </h1>
        </div>
      ))}
    </div>
  );
};

export default Grid;

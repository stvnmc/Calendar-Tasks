import React, { useState, useEffect } from "react";

const Grid = () => {
  const initialColors = Array.from({ length: 10 }, (_, index) => {
    return index % 2 === 0 ? "rgb(211 183 181 / 20%)" : "rgb(123 108 92 / 44%)";
  });

  const [colors, setColors] = useState(initialColors);

  const tasks = [
    { id: 1, type: false, task: "My mother's birthday." },
    { id: 4, type: false, task: "Meeting with work group." },
    { id: 7, type: false, task: "Night out with friends." },
    { id: 2, type: true, task: "My brother's birthday." },
    { id: 5, type: true, task: "University exam" },
    { id: 9, type: true, task: "Date with my girlfriend." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const newColors = colors.map((color) => {
        return color === "rgb(211 183 181 / 20%)"
          ? "rgb(123 108 92 / 44%)"
          : "rgb(211 183 181 / 20%)";
      });
      setColors(newColors);
    }, 4000);

    return () => clearInterval(interval);
  }, [colors]);

  return (
    <div className="grid">
      {colors.map((color, index) => {
        const matchingTask = tasks.find((task) => task.id === index + 1);

        return (
          <div
            key={index}
            className="square"
            style={{ backgroundColor: color }}
          >
            <h1
              style={{
                color:
                  color === "rgb(211 183 181 / 20%)" ? "#9e716a" : "#222d28",
              }}
            >
              {matchingTask ? matchingTask.id : index + 1}
            </h1>
            <p
              style={{
                opacity: matchingTask
                  ? color === "rgb(123 108 92 / 44%)"
                    ? 1
                    : 0
                  : 0,
              }}
            >
              {matchingTask?.task}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Grid;

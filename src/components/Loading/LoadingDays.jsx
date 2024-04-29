import React, { useEffect, useState } from "react";
import { TbPointFilled } from "react-icons/tb";

const LoadingDays = () => {
  const [scale1, setScale1] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setScale1((prevScale) => (prevScale % 3) + 1);
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loadingDays">
      <TbPointFilled className={scale1 === 1 ? "scale" : ""} />
      <TbPointFilled className={scale1 === 2 ? "scale" : ""} />
      <TbPointFilled className={scale1 === 3 ? "scale" : ""} />
    </div>
  );
};

export default LoadingDays;

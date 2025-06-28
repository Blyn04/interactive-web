import React from "react";
import "./styles/BackgroundAnimation.css";

const BackgroundAnimation = () => {
  const circles = Array.from({ length: 20 });

  return (
    <div className="background-animation">
      {circles.map((_, i) => (
        <span key={i} className="circle" style={{ "--i": i }}></span>
      ))}
    </div>
  );
};

export default BackgroundAnimation;

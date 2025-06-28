import React from "react";
import "./styles/AnimatedBackground.css";

const AnimatedBackground = () => {
  return (
    <div className="animated-bg">
      {[...Array(15)].map((_, i) => (
        <div key={i} className={`bubble bubble-${i + 1}`} />
      ))}
    </div>
  );
};

export default AnimatedBackground;

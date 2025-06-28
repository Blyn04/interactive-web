import React from "react";
import "./styles/Candle.css";

const Candle = ({ isBlownOut = false }) => (
  <div className="cake-container">
    <div className="cake">
      <div className="cake-layer layer-bottom"></div>
      <div className="cake-layer layer-middle"></div>
      <div className="cake-layer layer-top">
        <div className="cake-frosting"></div>
      </div>
    </div>

    <div className="candle-container">
      <div className={`candle ${isBlownOut ? "blown-out" : ""}`}>
        <div className="flame"></div>
        <div className="flame-glow"></div>
      </div>
    </div>
  </div>
);

export default Candle;

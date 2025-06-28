import React from "react";
import "./styles/Candle.css";

const Candle = ({ isBlownOut = false }) => (
  <div className="cake-container">
    {/* 🎂 Cake */}
    <div className="cake">
      <div className="cake-layer layer-bottom"></div>
      <div className="cake-layer layer-middle"></div>
      <div className="cake-layer layer-top">
        <div className="cake-frosting"></div>
      </div>
    </div>

    {/* 🕯️ Candle + flame */}
    <div className="candle-container">
      <div className={`candle ${isBlownOut ? "blown-out" : ""}`}>
        <div className="flame"></div>
        <div className="flame-glow"></div>
      </div>

      {/* 💨 Smoke appears only after blow‑out */}
      {isBlownOut && (
        <div className="smoke-wrapper">
          <span className="smoke-puff puff-1"></span>
          <span className="smoke-puff puff-2"></span>
          <span className="smoke-puff puff-3"></span>
        </div>
      )}
    </div>
  </div>
);

export default Candle;

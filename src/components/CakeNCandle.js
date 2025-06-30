import React from "react";
import "./styles/CakeNCandle.css";

const CakeNCandle = ({ isBlownOut = false }) => (
  <div className="cake">
    <div className="plate"></div>
    <div className="layer layer-bottom"></div>
    <div className="layer layer-middle"></div>
    <div className="layer layer-top"></div>
    <div className="icing"></div>
    <div className="drip drip1"></div>
    <div className="drip drip2"></div>
    <div className="drip drip3"></div>

    <div className={`candle ${isBlownOut ? "out" : ""}`}>
      <div className="flame"></div>
    </div>

    {isBlownOut && (
      <div className="smoke-wrapper">
        <span className="smoke-puff puff-1"></span>
        <span className="smoke-puff puff-2"></span>
        <span className="smoke-puff puff-3"></span>
        <span className="smoke-puff puff-4"></span>
      </div>
    )}
  </div>
);

export default CakeNCandle;

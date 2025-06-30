import React from "react";
import "./styles/CakeNCandle.css";

const CakeNCandle = ({ isBlownOut = false }) => (
  <div className="cake">
    {/* plate + layers */}
    <div className="plate" />
    <div className="layer layer-bottom" />
    <div className="layer layer-middle" />
    <div className="layer layer-top" />
    <div className="icing" />

    {/* drips */}
    <div className="drip drip1" />
    <div className="drip drip2" />
    <div className="drip drip3" />
    <div className="drip drip4" />

    <div className={`candle ${isBlownOut ? "out" : ""}`}>
    <div className="flame" />
    </div>

    {/* smoke after blow‑out */}
    {isBlownOut && (
      <div className="smoke-wrapper">
        <span className="smoke-puff puff-1" />
        <span className="smoke-puff puff-2" />
        <span className="smoke-puff puff-3" />
        <span className="smoke-puff puff-4" />
      </div>
    )}
  </div>
);

export default CakeNCandle;

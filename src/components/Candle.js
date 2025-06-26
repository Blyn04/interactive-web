import React from 'react';
import './styles/Candle.css';

const Candle = ({ isBlownOut }) => {
  return (
    <div className="candle-container">
      <div className={`candle ${isBlownOut ? 'blown-out' : ''}`}>
        <div className="flame"></div>
      </div>
    </div>
  );
};

export default Candle;

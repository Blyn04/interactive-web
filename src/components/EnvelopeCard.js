import React, { useState } from 'react';
import './styles/EnvelopeCard.css';
import BirthdayCard from './BirthdayCard';

const EnvelopeCard = () => {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <div className="envelope-wrapper">
      {!isOpened ? (
        <div className="envelope" onClick={() => setIsOpened(true)}>
          <div className="flap"></div>
          <div className="paper"></div> {/* 👈 Paper inside */}
          <div className="front"></div>
          <p className="open-text">Click to open</p>
        </div>
      ) : (
        <div className="card-reveal">
          <BirthdayCard />
        </div>
      )}
    </div>
  );
};

export default EnvelopeCard;

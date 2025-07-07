import React, { useState, useRef, useEffect } from 'react';
import './styles/EnvelopeCard.css';

const EnvelopeCard = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const wrapperRef = useRef(null);

  const handleClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    } else {
      setIsOpened(prev => !prev);
    }
  };

  // Handle clicks outside the envelope
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        if (isExpanded || isOpened) {
          setIsExpanded(false);
          setIsOpened(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, isOpened]);

  return (
    <div
      ref={wrapperRef}
      className={`envelope-wrapper ${isExpanded ? 'expanded' : ''} ${isOpened ? 'flap' : ''}`}
      onClick={handleClick}
    >
      <div className="envelope">
        <div className="envelope-back" /> {/* ✅ Solid background for the envelope */}
        <div className="letter">
          <div className="text">
            <strong>Maria Nadine Faye Rufo,</strong>
            <p>
              Wishing you a day filled with laughter, love, and sweet memories. 💌<br />
              May your birthday be as bright and joyful as you!
            </p>
          </div>
        </div>
      </div>
      <div className="heart"></div>
    </div>
  );
};

export default EnvelopeCard;

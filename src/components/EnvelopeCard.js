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
        <div className="envelope-back" /> 
        <div className="letter">
          <div className="text">
            <strong>Dear Maria Nadine Faye Rufo,</strong>
            <p>
              I can care for you in 4 ways: <br />
              With words, with silence, with presence, with prayer. <br />
              Or maybe just 3: <br />
              With my eyes, my hands, my heart. <br />
              No, 2 might be stronger: <br />
              With you, and for you. <br />
              Or maybe just 1 is all I need: <br />
              Always.
            </p>
          </div>
        </div>
      </div>
      <div className="heart"></div>
    </div>
  );
};

export default EnvelopeCard;

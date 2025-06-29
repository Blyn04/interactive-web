import React from "react";
import "./styles/BirthdayTitle.css";

const text = "Happy Birthday!";

const BirthdayTitle = () => (
  <h1 className="birthday-title">
    {Array.from(text).map((ch, i) => (
      <span key={i} style={{ "--delay": `${i * 0.08}s` }}>
        {ch === " " ? "\u00A0" : ch}
      </span>
    ))}
    <span className="cat-emoji"> 🐱</span>
  </h1>
);

export default BirthdayTitle;

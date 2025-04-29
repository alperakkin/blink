import React, { useState, useEffect, useRef } from "react";
import closeButton from "public/icons/xmark.svg";
import collapse from "public/icons/collapse.svg";
import "public/css/help.css";

const HelpScreen = ({ parser }) => {
  const [displaySection, setDisplaySection] = useState(null);

  const toggleSection = (section) => {
    setDisplaySection((prev) => (prev === section ? null : section));
  };

  return (
    <div className="help-container">
      <img
        src={closeButton}
        className="close-button"
        onClick={() => parser.closeHelp()}
      />
      <div className="help-group">
        <div className="title" onClick={() => toggleSection("themes")}>
          <div className="setting-title">Using Command Line</div>

          <img
            src={collapse}
            className={`collapse-icon ${
              displaySection === "themes" ? "rotated" : ""
            }`}
          />
        </div>

        <div
          className="theme collapse"
          style={{ display: displaySection === "themes" ? "block" : "none" }}
        >
          <div className="help-item">
            <div className="help-item-label">Theme</div>
            <select value="" className="setting-item-select">
              <option value="vs-dark">Dark Mode</option>
              <option value="vs">Light Mode</option>
            </select>
          </div>
          <div className="help-item-separator"></div>
        </div>
      </div>

      <div className="help-group">
        <div className="title" onClick={() => toggleSection("fonts")}>
          <div className="help-title">Fonts</div>

          <img
            src={collapse}
            className={`collapse-icon ${
              displaySection === "fonts" ? "rotated" : ""
            }`}
          />
        </div>

        <div
          className="font collapse"
          style={{ display: displaySection === "fonts" ? "block" : "none" }}
        >
          <div className="help-item">
            <div className="help-item-label">Font Size</div>
          </div>
          <div className="help-item-separator"></div>
        </div>
      </div>
    </div>
  );
};

export default HelpScreen;

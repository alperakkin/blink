import React, { useState, useEffect, useRef } from "react";
import closeButton from "public/icons/xmark.svg";
import "public/css/settings.css";

const SettingsScreen = ({ parser }) => {
  const [displayTheme, setDisplayTheme] = useState(-1);
  const [theme, setTheme] = useState(
    parser.codeEditor.settings.theme || "vs-dark"
  );

  const setDisplay = (state, stateFunc) => {
    stateFunc(state * -1);
  };

  useEffect(() => {
    const currentTheme = parser.codeEditor.readTheme();
    setTheme(currentTheme);
  }, []);

  useEffect(() => {
    parser.codeEditor.setTheme(theme);
  }, [theme]);

  return (
    <div className="settings-container">
      <img
        src={closeButton}
        className="close-button"
        onClick={() => parser.closeSettings()}
      />
      <div className="themes">
        <div
          className="title"
          onClick={() => setDisplay(displayTheme, setDisplayTheme)}
        >
          Themes & Colors
        </div>

        <div
          className="theme collapse"
          style={{ display: displayTheme === 1 ? "block" : "none" }}
        >
          <div className="theme-selection">
            <div className="theme-label">Theme:</div>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="theme-select"
            >
              <option value="vs-dark">Dark Mode</option>
              <option value="vs">Light Mode</option>
            </select>
          </div>
        </div>
      </div>
      <div className="editor-settings"></div>
      <div className="shortcut-settings"></div>
    </div>
  );
};

export default SettingsScreen;

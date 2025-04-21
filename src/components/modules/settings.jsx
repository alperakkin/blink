import React, { useState, useEffect, useRef } from "react";
import closeButton from "public/icons/xmark.svg";
import "public/css/settings.css";
import * as monaco from "monaco-editor";

const SettingsScreen = ({ parser }) => {
  const [displayTheme, setDisplayTheme] = useState(-1);
  const [theme, setTheme] = useState("vs-dark");

  const setDisplay = (state, stateFunc) => {
    stateFunc(state * -1);
  };

  useEffect(() => {
    monaco.editor.setTheme(theme);
    document.body.classList.remove("theme-dark", "theme-light");
    document.body.classList.add(theme === "vs" ? "theme-light" : "theme-dark");
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
            <select onChange={(e) => setTheme(e.target.value)}>
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

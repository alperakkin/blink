import React, { useState, useEffect, useRef } from "react";
import closeButton from "public/icons/xmark.svg";
import collapse from "public/icons/collapse.svg";
import "public/css/settings.css";

const SettingsScreen = ({ parser }) => {
  const [displaySection, setDisplaySection] = useState(null);
  const [theme, setTheme] = useState(
    parser.codeEditor.settings.theme || "vs-dark"
  );
  const [fontStyle, setFontStyle] = useState(
    parser.codeEditor.settings.selectedFont || "monaco"
  );

  const toggleSection = (section) => {
    setDisplaySection((prev) => (prev === section ? null : section));
  };

  const renderFontList = () => {
    return parser.codeEditor.settings.fontList.map((item) => (
      <option value={item}>{item}</option>
    ));
  };

  useEffect(() => {
    const currentTheme = parser.codeEditor.readTheme();
    setTheme(currentTheme);
    const currentFontStyle = parser.codeEditor.readFontStyle();
    setFontStyle(currentFontStyle);
  }, []);

  useEffect(() => {
    parser.codeEditor.setTheme(theme);
    parser.codeEditor.setFontStyle(fontStyle);
  }, [theme, fontStyle]);

  return (
    <div className="settings-container">
      <img
        src={closeButton}
        className="close-button"
        onClick={() => parser.closeSettings()}
      />
      <div className="setting-group">
        <div className="title" onClick={() => toggleSection("themes")}>
          <div className="setting-title">Themes</div>

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
          <div className="setting-item">
            <div className="setting-item-label">Theme</div>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="setting-item-select"
            >
              <option value="vs-dark">Dark Mode</option>
              <option value="vs">Light Mode</option>
            </select>
          </div>
          <div className="setting-item-separator"></div>
        </div>
      </div>

      <div className="setting-group">
        <div className="title" onClick={() => toggleSection("fonts")}>
          <div className="setting-title">Fonts</div>

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
          <div className="setting-item">
            <div className="setting-item-label">Fonts</div>
            <select
              value={fontStyle}
              onChange={(e) => setFontStyle(e.target.value)}
              className="setting-item-select"
            >
              {renderFontList()}
            </select>
          </div>
          <div className="setting-item-separator"></div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;

import React, { useState, useEffect, useRef } from "react";
import closeButton from "public/icons/xmark.svg";
import collapse from "public/icons/collapse.svg";
import "public/css/settings.css";
import { readJSON, writeJSON } from "libs/utils";

const SettingsScreen = ({ parser }) => {
  const [displaySection, setDisplaySection] = useState(null);
  const [theme, setTheme] = useState(
    parser.codeEditor.settings.theme || "vs-dark"
  );
  const [fontStyle, setFontStyle] = useState(
    parser.codeEditor.settings.selectedFont || "monaco"
  );

  const [fontSize, setFontSize] = useState(
    parser.codeEditor.settings.fontSize || 12
  );
  const [shortcuts, setShortcuts] = useState(readJSON("shortcuts"));
  const timeoutRef = useRef(null);

  const eventKeyToString = (e) => {
    let keys = [];
    if (e.ctrlKey) keys.push("ctrl");
    if (e.metaKey) keys.push("meta");
    if (e.altKey) keys.push("alt");
    if (e.shiftKey) keys.push("shift");

    const key = e.key.toLowerCase();
    if (!["control", "shift", "alt", "meta"].includes(key)) {
      keys.push(key);
    }

    return keys.join("+");
  };
  const handleFocus = (key) => {
    window.addEventListener("keydown", handleKeyDown);
  };

  const handleBlur = () => {
    window.removeEventListener("keydown", handleKeyDown);
  };

  const handleKeyDown = (e) => {
    e.preventDefault();

    const newKey = eventKeyToString(e);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const prevKey = e.target.value;
      const updated = { ...shortcuts };
      const description = updated[prevKey].description;
      const command = updated[prevKey].command;
      delete updated[prevKey];

      updated[newKey] = { description, command };

      writeJSON("shortcuts", updated);
      setShortcuts(readJSON("shortcuts"));
    }, 1000);
  };

  const toggleSection = (section) => {
    setDisplaySection((prev) => (prev === section ? null : section));
  };

  const renderFontList = () => {
    return parser.codeEditor.settings.fontList.map((item) => (
      <option key={item} value={item}>
        {item}
      </option>
    ));
  };

  const renderShortcuts = () => {
    return Object.keys(shortcuts).map((key) => (
      <div key={key} className="setting-item">
        <div className="setting-item-label">{shortcuts[key].description}</div>
        <input
          className="shortcut-input"
          value={key || ""}
          onFocus={() => handleFocus(key)}
          onBlur={handleBlur}
          onChange={() => {}}
        />
      </div>
    ));
  };

  useEffect(() => {
    const currentTheme = parser.codeEditor.readTheme();
    setTheme(currentTheme);
    const currentFontStyle = parser.codeEditor.readFontStyle();
    setFontStyle(currentFontStyle.selectedFont);
    setFontSize(currentFontStyle.fontSize);
  }, []);

  useEffect(() => {
    parser.codeEditor.setTheme(theme);
    parser.codeEditor.setFontStyle(fontStyle, fontSize);
  }, [theme, fontStyle, fontSize]);

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
            <div className="setting-item-label">Font Style</div>
            <select
              value={fontStyle}
              onChange={(e) => setFontStyle(e.target.value)}
              className="setting-item-select"
            >
              {renderFontList()}
            </select>
          </div>
          <div className="setting-item-separator"></div>
          <div className="setting-item">
            <div className="setting-item-label">Font Size</div>
            <input
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="setting-item-select"
              type="number"
            />
          </div>
          <div className="setting-item-separator"></div>
        </div>
      </div>
      <div className="setting-group">
        <div className="title" onClick={() => toggleSection("shortcuts")}>
          <div className="setting-title">Shortcuts</div>

          <img
            src={collapse}
            className={`collapse-icon ${
              displaySection === "shortcuts" ? "rotated" : ""
            }`}
          />
        </div>

        <div
          className="shortcut collapse"
          style={{ display: displaySection === "shortcuts" ? "block" : "none" }}
        >
          {renderShortcuts()}
          <div className="setting-item-separator"></div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;

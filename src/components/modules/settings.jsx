import React, { useState, useEffect, useRef } from "react";
import closeButton from "public/icons/xmark.svg";
import "public/css/settings.css";

const SettingsScreen = ({ parser }) => {
  return (
    <div className="settings-container">
      <p>Settings Screen</p>
      <img
        src={closeButton}
        className="close-button"
        onClick={() => parser.closeSettings()}
      />
    </div>
  );
};

export default SettingsScreen;

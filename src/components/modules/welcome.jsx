import React from "react";
import EditorLogo from "public/image/logo.png";
import "public/css/welcome.css";

const WelcomeScreen = () => {
  return (
    <div className="welcome-container">
      <div className="brand-info">
        <h1 className="brand-name">Blink</h1>
        <p className="brand-description">Start coding with blink editor..</p>
        <div className="welcome-logo">
          <img src={EditorLogo} />
        </div>
      </div>

      <div className="welcome-actions">
        <label className="new-file">New File</label>
        <label className="recent-files">Recent Files</label>
        <label className="recent-folders">Recent Folders</label>
      </div>
    </div>
  );
};

export default WelcomeScreen;

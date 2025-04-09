import React, { useState, useEffect, useRef } from "react";
import EditorLogo from "public/image/logo.png";
import "public/css/welcome.css";

const WelcomeScreen = ({ parser }) => {
  const [command, setCommand] = useState("");
  const [displayNewfile, setDisplayNewFile] = useState("none");
  const isEventAdded = useRef(false);

  useEffect(() => {
    if (!parser || isEventAdded.current) return;
    const handleKeyDown = (event) => {
      if (command && event.key == "Enter") {
        setDisplayNewFile("none");
        console.log("Command is", command);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    isEventAdded.current = true;

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      isEventAdded.current = false;
    };
  }, [parser, command]);

  return (
    <div className="welcome-container">
      <div className="brand-info">
        <h1 className="brand-name">Blink</h1>
        <p className="brand-description">Let's start coding..</p>
        <div className="welcome-logo">
          <img src={EditorLogo} />
        </div>
      </div>

      <div className="welcome-actions">
        <div className="new-file">
          <label
            className="new-file-label"
            onClick={() => setDisplayNewFile("block")}
          >
            New File
          </label>
          <input
            className="new-file-inp"
            type="text"
            value={command}
            style={{ display: displayNewfile }}
            onChange={(e) => setCommand(e.target.value)}
          />
        </div>

        <label className="recent-files">Recent Files</label>
        <label className="recent-folders">Recent Folders</label>
      </div>
    </div>
  );
};

export default WelcomeScreen;

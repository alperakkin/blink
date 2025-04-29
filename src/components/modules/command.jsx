import React, { useState, useEffect, useRef, forwardRef } from "react";
import "public/css/commandline.css";
import logo from "public/image/logo.png";

const CommandLine = forwardRef(
  (
    { onCommandSubmit, parser, setActiveSideBar, activeSideBar },
    commandFocusRef
  ) => {
    const [command, setCommand] = useState("");
    const isEventAdded = useRef(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (command.trim() !== "") {
        onCommandSubmit(command);
        setCommand("");
      }
    };

    const handleSideBar = () => {
      setActiveSideBar(!activeSideBar);
    };

    useEffect(() => {
      if (!parser || isEventAdded.current) return;

      const handleKeyDown = (event) => {
        let history = parser.getHistory(event.key, command);
        if (history === null || history === undefined) return;
        setCommand(history);
      };

      window.addEventListener("keydown", handleKeyDown);
      isEventAdded.current = true;

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        isEventAdded.current = false;
      };
    }, [parser, command]);

    return (
      <form className="command-form" onSubmit={handleSubmit}>
        <img
          className="command-image"
          src={logo}
          onClick={() => handleSideBar()}
        />
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter a command"
          ref={commandFocusRef}
        />
      </form>
    );
  }
);

export default CommandLine;

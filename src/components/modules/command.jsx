import React, { useState } from "react";
import "../../public/css/commandline.css";
import logo from "../../public/image/logo.png";
const CommandLine = ({ onCommandSubmit }) => {
  const [command, setCommand] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (command.trim() !== "") {
      onCommandSubmit(command);
      setCommand("");
    }
  };

  return (
    <form className="command-form" onSubmit={handleSubmit}>
      <img className="command-image" src={logo} />

      <input
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder="Enter a command"
      />
    </form>
  );
};

export default CommandLine;

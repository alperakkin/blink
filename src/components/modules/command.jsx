import React, { useState } from "react";

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
    <form
      onSubmit={handleSubmit}
      style={{
        position: "fixed",
        bottom: 0,
        width: "99%",
        backgroundColor: "#222",
        padding: "10px",
      }}
    >
      <label
        style={{
          color: "#ffffff",
          marginRight: "5px",
          fontWeight: "bold",
        }}
      >
        >
      </label>
      <input
        type="text"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        placeholder="Enter a command"
        style={{
          width: "80%",
          padding: "8px",
          backgroundColor: "#333",
          color: "#fff",
          border: "none",
        }}
      />
    </form>
  );
};

export default CommandLine;

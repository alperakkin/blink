import React, { useRef, useEffect } from "react";
import * as monaco from "monaco-editor";
import CommandLine from "./modules/command";
const Editor = () => {
  const editorRef = useRef(null);
  let editor = null;
  useEffect(() => {
    if (!editorRef.current) return;

    editor = monaco.editor.create(editorRef.current, {
      value: "// Write your code here",
      language: "plaintext",
      theme: "vs-dark",
      automaticLayout: true,
    });

    return () => editor.dispose();
  }, []);

  const handleCommandSubmit = (cmd) => {
    console.log("Command:", cmd);
    editor.getModel().setValue("");
    editor.getModel().setLanguage(cmd);
  };

  return (
    <div className="container">
      <div className="editor">
        <div ref={editorRef} style={{ width: "100%", height: "500px" }} />
      </div>
      <div className="command-line-container">
        <CommandLine id="cmd" onCommandSubmit={handleCommandSubmit} />
      </div>
    </div>
  );
};

export default Editor;

import React, { useState, useRef, useEffect } from "react";
import * as monaco from "monaco-editor";
import CommandLine from "./modules/command";
import FileManager from "./modules/sidebar";
import "../public/css/editor.css";
import Parser from "../libs/parser";

const Editor = () => {
  const editorRef = useRef(null);
  const parserRef = useRef(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current = monaco.editor.create(editorRef.current, {
      value: "// Write your code here",
      language: "plaintext",
      theme: "vs-dark",
      automaticLayout: true,
    });

    return () => editor.dispose();
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      parserRef.current = new Parser(editorRef.current, setFiles);
    }
  }, []);

  return (
    <div className="container">
      <div className="editor">
        <FileManager files={files} />
        <div className="code-editor" ref={editorRef} />
      </div>
      <div className="command-line-container">
        <CommandLine
          id="cmd"
          onCommandSubmit={(cmd) => parserRef.current?.handleCommandSubmit(cmd)}
        />
      </div>
    </div>
  );
};

export default Editor;

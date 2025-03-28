import React, { useState, useRef, useEffect } from "react";
import * as monaco from "monaco-editor";
import CommandLine from "components/modules/command";
import FileManager from "components/modules/sidebar/sidebar";
import "public/css/editor.css";
import Parser from "libs/parser";

const Editor = () => {
  const editorRef = useRef(null);
  const parserRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [parserInstance, setParserInstance] = useState(null);

  useEffect(() => {
    if (!editorRef.current) return;
    editorRef.current = monaco.editor.create(editorRef.current, {
      value: "",
      language: "plaintext",
      theme: "vs-dark",
      automaticLayout: true,
    });

    return () => editor.dispose();
  }, []);

  useEffect(() => {
    if (editorRef.current) {
      parserRef.current = new Parser(editorRef.current, setFiles);
      setParserInstance(parserRef.current);
    }
  }, []);

  return (
    <div className="container">
      <div className="editor">
        <FileManager files={files} parser={parserInstance} />
        <div className="code-editor" ref={editorRef} />
      </div>
      <div className="command-line-container">
        <CommandLine
          id="cmd"
          parser={parserInstance}
          onCommandSubmit={(cmd) => parserRef.current?.handleCommandSubmit(cmd)}
        />
      </div>
    </div>
  );
};

export default Editor;

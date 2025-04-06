import React, { useState, useRef, useEffect } from "react";
import CommandLine from "components/modules/command";
import FileManager from "components/modules/sidebar/sidebar";
import "public/css/editor.css";
import Parser from "libs/parser";
import CodeEditor from "libs/code_editor";
import { readJSON } from "../libs/utils";

const Editor = () => {
  const editorRef = useRef(null);
  const parserRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [parserInstance, setParserInstance] = useState(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const codeEditor = new CodeEditor();
    codeEditor.createNew(editorRef.current);
    editorRef.current = codeEditor;

    return () => {
      codeEditor?.dispose(editorRef.current);
    };
  }, []);

  useEffect(() => {
    if (editorRef?.current) {
      parserRef.current = new Parser(editorRef.current, setFiles);
      parserRef.current.gotoFolder(readJSON("settings/fileSettings.json").cwd);
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

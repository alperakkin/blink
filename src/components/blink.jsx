import React, { useState, useRef, useEffect } from "react";
import CommandLine from "components/modules/command";
import FileManager from "components/modules/sidebar/sidebar";
import StatusBar from "./modules/statusbar";
import "public/css/blink.css";
import Parser from "libs/parser";
import CodeEditor from "libs/code_editor";
import { readJSON } from "../libs/utils";
import WelcomeScreen from "./modules/welcome";

const Blink = () => {
  const editorRef = useRef(null);
  const parserRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [parserInstance, setParserInstance] = useState(null);
  const [activeFile, setActiveFile] = useState(null);

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
      parserRef.current = new Parser(
        editorRef.current,
        setFiles,
        setActiveFile
      );
      const settings = readJSON("fileSettings");
      parserRef.current.gotoFolder(settings.cwd);
      parserRef.current.openFile(settings.lastOpenedFile);
      setParserInstance(parserRef.current);
    }
  }, []);

  return (
    <div className="container">
      <div className="editor">
        <FileManager files={files} parser={parserInstance} />
        <div
          className="code-editor"
          ref={editorRef}
          style={{
            display: activeFile ? "block" : "none",
          }}
        />
        {!activeFile && <WelcomeScreen parser={parserInstance} />}
      </div>
      <div className="command-line-container">
        <CommandLine
          id="cmd"
          parser={parserInstance}
          onCommandSubmit={(cmd) => parserRef.current?.handleCommandSubmit(cmd)}
        />
      </div>
      <div className="status-bar-container">
        <StatusBar parser={parserInstance} />
      </div>
    </div>
  );
};

export default Blink;

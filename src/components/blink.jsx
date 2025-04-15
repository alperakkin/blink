import React, { useState, useRef, useEffect } from "react";
import CommandLine from "components/modules/command";
import FileManager from "components/modules/sidebar/sidebar";
import StatusBar from "./modules/statusbar";
import "public/css/blink.css";
import Parser from "libs/parser";
import CodeEditor from "libs/code_editor";
import { readJSON } from "../libs/utils";
import WelcomeScreen from "./modules/welcome";
import TabManager from "./modules/tab/tab_manager";

const Blink = () => {
  const editorRef = useRef(null);
  const parserRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [parserInstance, setParserInstance] = useState(null);
  const [activeTabID, setActiveTabID] = useState(null);
  const firstRun = useRef(true);

  useEffect(() => {
    if (!editorRef?.current) return;

    const codeEditor = new CodeEditor();
    codeEditor.createNew(editorRef.current);

    const settings = readJSON("fileSettings");
    let recentFolders = settings.recentFolders || [];

    parserRef.current = new Parser(
      codeEditor,
      setFiles,
      setActiveTabID,
      recentFolders
    );

    if (firstRun.current == true) {
      parserRef.current.gotoFolder(settings.cwd);
      let tabs = settings.recentTabs || [];
      for (const tab of tabs) parserRef.current.openFile(tab);
      firstRun.current = false;
    }

    setParserInstance(parserRef.current);

    return () => {
      codeEditor?.dispose?.();
    };
  }, []);

  return (
    <div className="container">
      <div className="editor">
        <FileManager files={files} parser={parserInstance} />
        {
          <TabManager
            ref={editorRef}
            activeTabID={activeTabID}
            parser={parserInstance}
          />
        }

        {activeTabID == null && <WelcomeScreen parser={parserInstance} />}
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

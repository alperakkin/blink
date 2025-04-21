import React, { useState, useRef, useEffect } from "react";
import CommandLine from "components/modules/command";
import FileManager from "components/modules/sidebar/sidebar";
import StatusBar from "./modules/statusbar";
import "public/css/blink.css";
import Parser from "libs/parser";
import CodeEditor from "libs/code_editor";
import { readJSON } from "libs/utils";
import WelcomeScreen from "./modules/welcome";
import TabManager from "./modules/tab/tab_manager";
import ShortCutHandler from "libs/shortcut_handler";
import SettingsScreen from "./modules/settings";

const Blink = () => {
  const editorRef = useRef(null);
  const parserRef = useRef(null);
  const commandFocusRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [parserInstance, setParserInstance] = useState(null);
  const [activeTabID, setActiveTabID] = useState(null);
  const [activeSettings, setActiveSettings] = useState(false);
  const [activeSideBar, setActiveSideBar] = useState(true);

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
      recentFolders,
      commandFocusRef,
      setActiveSettings
    );

    if (firstRun.current == true) {
      parserRef.current.gotoFolder(settings.cwd);
      let tabs = settings.recentTabs || [];
      for (const tab of tabs) parserRef.current.openFile(tab);
      firstRun.current = false;
    }

    setParserInstance(parserRef.current);

    const shortcut = new ShortCutHandler(
      readJSON("shortcuts"),
      parserRef.current
    );
    const handleKeyDown = (e) => {
      shortcut.mapKey(e);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      codeEditor?.dispose?.();
    };
  }, []);

  return (
    <div className="container">
      <div className="editor">
        {!activeSettings && activeSideBar && (
          <FileManager files={files} parser={parserInstance} />
        )}
        {
          <TabManager
            ref={editorRef}
            activeTabID={activeTabID}
            parser={parserInstance}
          />
        }
        {activeSettings && <SettingsScreen parser={parserInstance} />}
        {activeTabID == null && !activeSettings && (
          <WelcomeScreen parser={parserInstance} />
        )}
      </div>
      <div className="command-line-container">
        <CommandLine
          id="cmd"
          parser={parserInstance}
          setActiveSideBar={setActiveSideBar}
          activeSideBar={activeSideBar}
          ref={commandFocusRef}
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

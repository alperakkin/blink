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
import HelpScreen from "./modules/help";

const Blink = () => {
  const WELCOME_VIEW = "welcome";
  const SETTINGS_VIEW = "settings";
  const HELP_VIEW = "help";
  const EDITOR_VIEW = "editor";
  const viewMap = {
    WELCOME_VIEW,
    SETTINGS_VIEW,
    HELP_VIEW,
    EDITOR_VIEW,
  };
  const editorRef = useRef(null);
  const parserRef = useRef(null);
  const commandFocusRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [parserInstance, setParserInstance] = useState(null);
  const [activeTabID, setActiveTabId] = useState(null);
  const [activeView, setActiveView] = useState(viewMap.WELCOME_VIEW);
  const [activeSideBar, setActiveSideBar] = useState(viewMap.WELCOME_VIEW);

  const firstRun = useRef(true);

  useEffect(() => {
    if (!editorRef?.current) return;

    const editorSettings = readJSON("editorSettings");
    const fileSettings = readJSON("fileSettings");
    const codeEditor = new CodeEditor(editorSettings);
    codeEditor.createNew(editorRef.current);

    let recentFolders = fileSettings.recentFolders || [];

    parserRef.current = new Parser(
      codeEditor,
      setFiles,
      setActiveTabId,
      setActiveView,
      recentFolders,
      commandFocusRef,
      viewMap
    );

    console.log(parserRef.current);

    if (firstRun.current == true) {
      parserRef.current.gotoFolder(fileSettings.cwd);
      let tabs = fileSettings.recentTabs || [];
      for (const tab of tabs) parserRef.current.openFile(tab);
      parserRef.current.codeEditor.setTheme(editorSettings.theme);
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
        {activeSideBar && <FileManager files={files} parser={parserInstance} />}
        {
          <TabManager
            ref={editorRef}
            activeTabID={activeTabID}
            parser={parserInstance}
          />
        }
        {activeView === viewMap.HELP_VIEW && (
          <HelpScreen parser={parserInstance} />
        )}
        {activeView === viewMap.SETTINGS_VIEW && (
          <SettingsScreen parser={parserInstance} />
        )}
        {activeView === viewMap.WELCOME_VIEW && (
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

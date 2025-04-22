import { loadFiles, writeJSON, readJSON } from "../libs/utils";
import path from 'path-browserify';

const MAX_HISTORY = 100;
const MAX_RECENT_FOLDERS = 5;
class Parser {
    constructor(codeEditor, setFiles, setActiveTabID, recentFolders,
        commandFocusRef, setActiveSettings) {
        this.codeEditor = codeEditor;
        this.setFiles = setFiles;
        this.setActiveTabID = setActiveTabID;
        this.commandFocusRef = commandFocusRef;
        this.setActiveSettings = setActiveSettings;
        this.cwd = "/";
        this.prevCwd = null;
        this.history = [];
        this.historyCursor = -1;
        this.recentFolders = recentFolders;


        this.keys = {
            'cd': (path) => this.gotoFolder(path),
            'open': (filePath) => this.openFile(filePath),
            'new': (path) => this.newFileOrFolder(path),
            'rm': (path) => this.deleteFileOrFolder(path),
            'save': (path) => this.saveFile(path),
            'close': () => this.closeFile(),
            'focusCommand': () => this.focusCommand(),
            'focusEditor': () => this.focusEditor(),
            'nextTab': () => this.nextTab(),
            'runEditorAction': (action) => this.runEditorAction(action),
            'settings': () => this.displaySettings(),
            'zoom': (arg) => this.zoom(arg)
        }



    }

    parseCmd(cmd) {
        let args = cmd.split(" ");
        let invokeCmd = this.keys[args[0].trim()];
        if (!invokeCmd) return;
        invokeCmd(...args.slice(1));
    }

    getHistory(state, cmd) {
        if (this.history.length === 0) return;
        switch (state) {
            case "ArrowUp":
                if (this.historyCursor === -1 || !cmd) {
                    this.historyCursor = this.history.length - 1;
                } else if (this.historyCursor > 0) {
                    this.historyCursor--;
                }
                break;

            case "ArrowDown":
                if (this.historyCursor < this.history.length - 1) {
                    this.historyCursor++;
                } else {
                    this.historyCursor = this.history.length - 1;
                    return "";
                }
                break
            case "Enter":
                this.historyCursor = this.history.length - 1;
                return;
            case "Escape":
                return "";
            default:
                return;
        }

        return this.history[this.historyCursor];

    }


    handleCommandSubmit(cmd) {
        this.history.push(cmd);
        if (this.history.length >= MAX_HISTORY)
            this.history = this.history.slice(1, MAX_HISTORY);

        this.parseCmd(cmd);
    };

    gotoFolder(userPath) {
        if (userPath === ".." && this.prevCwd !== this.cwd) this.prevCwd = this.cwd;
        let newPath = path.isAbsolute(userPath)
            ? userPath : path.join(this.cwd, userPath);

        loadFiles(newPath, this.setFiles);
        this.cwd = newPath;

        let settings = readJSON("fileSettings");
        settings.cwd = this.cwd;
        writeJSON("fileSettings", settings);

    }

    refresh() {
        this.gotoFolder(this.cwd);
    }

    addToRecent() {
        if (this.cwd && !this.recentFolders.includes(this.cwd))
            this.recentFolders.unshift(this.cwd);
        if (this.recentFolders.length > MAX_RECENT_FOLDERS)
            this.recentFolders.pop();

    }

    newFileOrFolder(filePath) {
        const fullPath = path.join(this.cwd, filePath);
        if (path.extname(fullPath)) {
            window.electron.createFile(fullPath, "");
            this.openFile(fullPath);
        }
        else {
            window.electron.makeDir(fullPath);
        }

        this.refresh();

    }

    deleteFileOrFolder(filePath = null) {

        this.codeEditor.deleteFileHandler(this.cwd, filePath)
        this.refresh();

    }

    openFile(filePath) {
        if (filePath === undefined || filePath === null) return;
        let settings = readJSON("fileSettings");

        const result = window.electron.readFile(filePath);

        if (result.exists === false) {
            this.setActiveTabID(null);
            settings.recentTabs = [];
            writeJSON("fileSettings", settings);
            return;
        };

        let tabId = this.codeEditor.openFileHandler(filePath, result.source);
        settings.recentTabs = settings.recentTabs || [];
        settings.recentTabs = this.codeEditor.addRecentTabs(filePath, settings.recentTabs);

        this.setActiveTabID(tabId);
        this.addToRecent();
        settings.recentFolders = this.recentFolders;
        writeJSON("fileSettings", settings);

    }

    saveFile(filePath = null) {
        this.codeEditor.saveFileHandler(filePath);
        this.refresh();

    }
    switchTab(ID) {
        this.codeEditor.switchTabHandler(ID);
        this.setActiveTabID(this.codeEditor.activeTabID);

    }

    nextTab() {
        let nextTabIndex = this.codeEditor.getTabIndex(this.codeEditor.activeTabID) + 1;
        nextTabIndex = nextTabIndex % this.codeEditor.tabs.length;
        let nextTabElement = this.codeEditor.tabs[nextTabIndex];
        if (!nextTabElement) return;
        this.switchTab(nextTabElement.ID);
    }

    closeFile() {

        if (this.codeEditor.activeTabID == null) return;
        const tab = this.codeEditor.getTabByID(this.codeEditor.activeTabID);
        const filePath = tab.filePath;
        if (this.codeEditor.hasChanged(filePath)) {
            let userResponse = confirm(`Save ${filePath}?`);
            if (userResponse == false) return;
        }

        this.saveFile(filePath);
        this.codeEditor.closeFileHandler(this.codeEditor.activeTabID);
        this.setActiveTabID(this.codeEditor.activeTabID);
    }
    focusCommand() {
        this.commandFocusRef.current.focus();
    }
    focusEditor() {
        this.codeEditor.editor.focus();
    }
    runEditorAction(actionId) {
        const action = this.codeEditor.editor.getAction(actionId);

        if (action && action.isSupported()) {
            action.run();
        }
    }

    displaySettings() {
        this.setActiveSettings(true);
        this.setActiveTabID(null);
    }

    closeSettings() {
        this.setActiveSettings(false);
        if (this.codeEditor.tabs.length > 0)
            this.setActiveTabID(true);


    }
    zoom(arg) {
        const mapping = {
            "in": 1,
            "out": -1
        }
        console.log(this.codeEditor.settings);
        this.codeEditor.setFontStyle(null, this.codeEditor.settings.fontSize + mapping[arg]);
    }
}

export default Parser;
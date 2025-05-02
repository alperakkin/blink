import * as monaco from "monaco-editor";
import path from 'path-browserify';
import { writeJSON, readJSON } from "./utils";

const MAX_RECENT_TABS = 20;
class CodeEditor {
    constructor(editorSettings) {
        this.editor;
        this.activeTabID = null;
        this.tabs = [];
        this.fileTypes = {
            ".js": "javascript",
            ".py": "python",
            ".html": "html",
            ".txt": "plaintext",
            ".css": "css",
            ".ts": "typescript",
            ".cpp": "cpp",
            ".MD": "markdown",
            ".cs": "csharp",
            ".xml": "xml"
        }
        this.settings = editorSettings;
        this.theme = this.settings.theme || "vs-dark";
    }

    hasChanged() {
        let currentContent = this.getTabByID(this.activeTabID).model.getValue();
        return currentContent !== this.getTabByID(this.activeTabID).lastContent;
    }

    getTabByID(ID) {
        for (const tab of this.tabs) {
            if (tab.ID === ID) return tab;
        }
    }

    getTabIndex(ID) {
        for (let i = 0; i < this.tabs.length; i++) {
            if (this.tabs[i].ID === ID) return i;
        }
    }
    addRecentTabs(filePath, recentTabs) {
        if (filePath && !recentTabs.includes(filePath))
            recentTabs.unshift(filePath);
        if (recentTabs.length > MAX_RECENT_TABS)
            recentTabs.pop();
        return recentTabs;
    }

    removeTabByID(ID) {
        this.tabs = this.tabs.filter(tab => tab.ID != ID);
    }


    switchTabHandler(ID) {
        const tab = this.getTabByID(ID);
        if (!tab) return;
        const model = tab.model;
        this.editor.setModel(model);
        this.activeTabID = ID;



    }

    createNew(domNode) {
        this.editor = monaco.editor.create(domNode, {
            value: "",
            language: this.language,
            theme: this.theme,
            automaticLayout: true,
        })
    }

    dispose(editorInstance) {
        editorInstance?.dispose();
    }



    setLanguage(ext) {
        return this.fileTypes[ext] || "plaintext";

    }



    setModel(filePath, source) {
        const fileName = path.basename(filePath);
        const ext = path.extname(filePath);
        const model = monaco.editor.createModel(source, this.setLanguage(ext));
        const ID = this.tabs.length;

        this.tabs.push({
            ID: ID,
            name: fileName,
            filePath: filePath,
            model: model,
            lastContent: source
        })
        this.editor.setModel(model);
        return ID;
    }


    openFileHandler(filePath, source) {
        const tabId = this.setModel(filePath, source);
        this.activeTabID = tabId;
        return tabId;
    }

    deleteFileHandler(cwd, filePath = null) {
        filePath = filePath == null ? this.getTabByID(this.activeTabID).filePath : filePath;
        if (!filePath) return;
        const fullPath = path.join(cwd, filePath);
        if (path.extname(fullPath)) {
            window.electron.deleteFile(fullPath);

        }
        else {
            window.electron.deleteFolder(fullPath);
        }
    }

    saveFileHandler(filePath = null) {
        const tab = this.getTabByID(this.activeTabID);
        if (!filePath && !tab) return;
        filePath = filePath == null ? this.getTabByID(this.activeTabID).filePath : filePath;
        if (!filePath) return;
        const source = this.editor.getModel().getValue();
        window.electron.createFile(filePath, source);
        this.getTabByID(this.activeTabID).lastContent = source;

    }



    closeFileHandler(ID) {
        const closedTab = this.getTabByID(ID);
        const isActive = this.activeTabID === ID;

        this.removeTabByID(ID);
        let settings = readJSON("fileSettings");
        settings.recentTabs = settings.recentTabs.filter(filePath => filePath != closedTab.filePath);
        writeJSON("fileSettings", settings);

        if (isActive && this.tabs.length > 0) {
            const nextTab = this.tabs[0];
            this.editor.setModel(nextTab.model);
            this.activeTabID = nextTab.ID;
        } else if (this.tabs.length === 0) {
            this.editor.setModel(null);
            this.activeTabID = null;
        }

        closedTab.model.dispose();

    }

    readTheme() {
        const editorSettings = readJSON("editorSettings");
        return editorSettings.theme || "vs-dark";
    }

    setTheme(theme) {
        let editorSettings = readJSON("editorSettings");
        editorSettings.theme = theme;
        monaco.editor.setTheme(theme);
        document.body.classList.remove("theme-dark", "theme-light");
        document.body.classList.add(theme === "vs" ? "theme-light" : "theme-dark");
        writeJSON("editorSettings", editorSettings);
        this.settings = editorSettings;
    }
    readFontStyle() {
        const editorSettings = readJSON("editorSettings");
        return {
            selectedFont: editorSettings.selectedFont || "monaco",
            fontSize: editorSettings.fontSize || 12
        }
    }

    setFontStyle(fontStyle, fontSize) {
        let editorSettings = readJSON("editorSettings");
        editorSettings.selectedFont = fontStyle || editorSettings.selectedFont;
        editorSettings.fontSize = parseInt(fontSize) || editorSettings.fontSize;
        this.editor.updateOptions({
            fontFamily: fontStyle,
            fontSize: fontSize
        });

        writeJSON("editorSettings", editorSettings);
        this.settings = editorSettings;
    }
}

export default CodeEditor;
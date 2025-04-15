import * as monaco from "monaco-editor";
import path from 'path-browserify';
import { writeJSON, readJSON } from "./utils";

const MAX_RECENT_TABS = 20;
class CodeEditor {
    constructor() {
        this.editor;
        this.theme = "vs-dark";
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
        filePath = filePath == null ? this.getTabByID(this.activeTabID).filePath : filePath;
        if (!filePath) return;
        const source = this.editor.getModel().getValue();
        window.electron.createFile(filePath, source);
        this.getTabByID(this.activeTabID).lastContent = source;

    }

    closeFileHandler(ID) {
        let tab = this.getTabByID(ID);

        let settings = readJSON("fileSettings");
        settings.recentTabs = Array.from(new Set(settings.recentTabs.filter(recent => recent !== tab.filePath)));
        writeJSON("fileSettings", settings);
        this.removeTabByID(ID);
        this.activeTabID = this.tabs.length > 0 ? this.tabs[0].ID : null;
        if (!this.activeTabID) return;
        tab = this.getTabByID(this.activeTabID);

        this.editor.setModel(tab.model);

    }
}

export default CodeEditor;
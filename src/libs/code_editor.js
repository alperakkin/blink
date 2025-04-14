import * as monaco from "monaco-editor";
import path from 'path-browserify';

class CodeEditor {
    constructor() {
        this.editor;
        this.theme = "vs-dark";
        this.activeFile = null;
        this.lastContent = null;
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
        let currentContent = this.editor.getModel().getValue();
        return currentContent !== this.lastContent;
    }

    getTabIndex(filePath) {
        for (let index = 0; index < this.tabs.length; index++) {
            if (this.tabs[index].filePath == filePath) return index;
        }
    }

    switchTab(ID) {
        const model = this.tabs[ID].model;
        this.editor.setModel(model);



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
    }


    openFileHandler(filePath, source) {
        this.setModel(filePath, source);

        this.activeFile = filePath;
    }

    deleteFileHandler(cwd, filePath = null) {
        filePath = filePath == null ? this.activeFile : filePath;
        if (!filePath) return;
        const fullPath = path.join(cwd, filePath);
        if (path.extname(fullPath)) {
            window.electron.deleteFile(fullPath);

        }
        else {
            window.electron.deleteFolder(fullPath);
        }
    }

    saveFileHandler(cwd, filePath = null) {

        filePath = filePath == null ? this.activeFile : filePath;
        if (!filePath) return;
        const fullPath = path.join(cwd, filePath);
        const source = this.editor.getModel().getValue();
        window.electron.createFile(fullPath, source);
        this.lastContent = source;

    }

    closeFileHandler(filePath) {
        let index = this.getTabIndex(filePath);
        this.tabs.splice(index, 1);
        this.activeFile = this.tabs.length > 0 ? this.tabs[0].filePath : null;

    }
}

export default CodeEditor;
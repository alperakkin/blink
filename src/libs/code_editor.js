import * as monaco from "monaco-editor";
import path from 'path-browserify';

class CodeEditor {
    constructor() {
        this.editor;
        this.theme = "vs-dark";
        this.language = "plaintext";
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
        this.language = this.fileTypes[ext] || "plaintext";
        monaco.editor.setModelLanguage(
            this.editor.getModel(), this.language
        );
    }


    openFileHandler(filePath, source) {
        const fileName = path.basename(filePath);
        const ext = path.extname(filePath);
        this.activeFile = fileName;
        this.setLanguage(ext);
        this.editor.getModel().setValue(source);
        this.lastContent = source;

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
}

export default CodeEditor;
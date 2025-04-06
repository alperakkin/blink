import * as monaco from "monaco-editor";
import path from 'path-browserify';

class CodeEditor {
    constructor() {
        this.editor;
        this.theme = "vs-dark";
        this.language = "plaintext";
        this.activeFile = null;
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
        self.activeFile = filePath;
        this.setLanguage(ext);
        this.editor.getModel().setValue(source);

    }
}

export default CodeEditor;
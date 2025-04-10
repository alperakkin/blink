import { loadFiles, writeJSON, readJSON } from "../libs/utils";
import path from 'path-browserify';

const MAX_HISTORY = 100;
class Parser {
    constructor(codeEditor, setFiles, setActiveFile) {
        this.codeEditor = codeEditor;
        this.setFiles = setFiles;
        this.setActiveFile = setActiveFile;
        this.cwd = "/";
        this.prevCwd = null;
        this.history = [];
        this.historyCursor = -1;


        this.keys = {
            'cd': (path) => this.gotoFolder(path),
            'open': (path) => this.openFile(path),
            'new': (path) => this.newFileOrFolder(path),
            'rm': (path) => this.deleteFileOrFolder(path),
            'save': (path) => this.saveFile(path)
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

    newFileOrFolder(filePath) {
        const fullPath = path.join(this.cwd, filePath);
        if (path.extname(fullPath)) {
            window.electron.createFile(fullPath, "");
            this.openFile(filePath);
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
        const fullPath = path.join(this.cwd, filePath);

        const result = window.electron.readFile(fullPath);

        if (result.exists === false) {
            this.setActiveFile(null);
            settings.lastOpenedFile = null;
            writeJSON("fileSettings", settings);

            return;
        };
        this.codeEditor.openFileHandler(fullPath, result.source);

        settings.lastOpenedFile = filePath;
        writeJSON("fileSettings", settings);
        this.setActiveFile(filePath);




    }

    saveFile(filePath = null) {
        this.codeEditor.saveFileHandler(this.cwd, filePath);
        this.refresh();

    }
}

export default Parser;
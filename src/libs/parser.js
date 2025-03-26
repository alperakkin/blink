import { loadFiles } from "../libs/utils";
import path from 'path-browserify';
class Parser {
    constructor(editor, setFiles) {
        this.editor = editor;
        this.setFiles = setFiles;
        this.cwd = "/";


        this.keys = {
            'cd': (path) => this.gotoFolder(path)
        }

    }

    parseCmd(cmd) {
        let args = cmd.split(" ");
        let invokeCmd = this.keys[args[0].trim()];
        if (!invokeCmd) return;
        invokeCmd(...args.slice(1));
    }


    handleCommandSubmit(cmd) {
        this.editor.getModel().setValue("");
        this.parseCmd(cmd);
    };

    gotoFolder(userPath) {
        let newPath = path.isAbsolute(userPath)
            ? userPath : path.join(this.cwd, userPath);

        loadFiles(newPath, this.setFiles);
        this.cwd = newPath;
    }
}

export default Parser;
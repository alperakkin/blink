import { loadFiles } from "../libs/utils";

class Parser {
    constructor(editor, setFiles) {
        this.editor = editor;
        this.setFiles = setFiles;


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

    gotoFolder(path) {
        loadFiles(path, this.setFiles);
    }
}

export default Parser;
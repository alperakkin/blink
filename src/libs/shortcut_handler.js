import * as monaco from "monaco-editor";

const EDITOR_SCRIPT = "blink.editor."
class ShortCutHandler {
    constructor(keyMapping, parser) {
        this.keyMapping = keyMapping;
        this.parser = parser;

        this.bindToEditor();
    }


    eventKeyToString(e) {

        let keys = [];
        if (e.ctrlKey) keys.push("ctrl");
        if (e.metaKey) keys.push("meta");
        if (e.altKey) keys.push("alt");
        if (e.shiftKey) keys.push("shift");

        const key = e.key.toLowerCase();
        if (!["control", "shift", "alt", "meta"].includes(key)) {
            keys.push(key);
        }


        return keys.join("+");
    }

    mapKey(event) {
        const hotkey = this.eventKeyToString(event);
        const hotKeyItem = this.keyMapping[hotkey];
        if (hotKeyItem) {
            event.preventDefault();
            if (!hotKeyItem.description.startsWith(EDITOR_SCRIPT)) {
                let command = hotKeyItem.command;
                let args = [];
                if (hotKeyItem.description.includes(".args.")) {
                    args = hotKeyItem.description.split(".args.")[1];
                    command = command + " " + args.replace(".", " ");
                }

                this.parser.parseCmd(command);
            }

        }

    }

    bindToEditor() {
        const editor = this.parser.codeEditor.editor;

        Object.entries(this.keyMapping).forEach(([keyStr, { description, command }]) => {
            const keyCode = ShortCutHandler.parseKeybinding(keyStr);

            editor.addCommand(keyCode, () => {
                if (
                    typeof this.parser[command] === 'function' && description.startsWith(EDITOR_SCRIPT)) {
                    this.parser[command](description.split('blink.')[1]);
                }
            });
        });
    }

    static parseKeybinding(keyStr) {
        const parts = keyStr.toLowerCase().split('+');
        let key = 0;

        parts.forEach(part => {
            switch (part.trim()) {
                case 'ctrl':
                case 'cmd':
                case 'meta':
                    key |= monaco.KeyMod.CtrlCmd;
                    break;
                case 'shift':
                    key |= monaco.KeyMod.Shift;
                    break;
                case 'alt':
                    key |= monaco.KeyMod.Alt;
                    break;
                default:
                    const code = 'Key' + part.toUpperCase();
                    key |= monaco.KeyCode[code] || monaco.KeyCode[part.toUpperCase()];
            }
        });

        return key;
    }



}

export default ShortCutHandler;
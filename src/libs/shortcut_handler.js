
class ShortCutHandler {
    constructor(keyMapping, parser) {
        this.keyMapping = keyMapping;
        this.parser = parser;
    }


    eventKeyToString(e) {
        console.log(e);
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
            this.parser.parseCmd(hotKeyItem.command);
        }



    }

}

export default ShortCutHandler;
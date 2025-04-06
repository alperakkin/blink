const { contextBridge, ipcRenderer } = require("electron");
const fs = require('fs');

contextBridge.exposeInMainWorld("api", {
    log: (message) => console.log(message),

});

contextBridge.exposeInMainWorld("electron", {
    readDirectory: (dirPath) => ipcRenderer.invoke('read-directory', dirPath),
    selectFolder: () => ipcRenderer.invoke('select-folder'),
    readFile: (filePath) => {
        return fs.readFileSync(filePath, 'utf-8');
    }
})

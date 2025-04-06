const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    log: (message) => console.log(message),

});

contextBridge.exposeInMainWorld("electron", {
    readDirectory: (dirPath) => ipcRenderer.invoke('read-directory', dirPath),
    selectFolder: () => ipcRenderer.invoke('select-folder'),
})

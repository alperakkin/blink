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
    },
    createFile: (filePath, content) => {
        fs.writeFileSync(filePath, content, "utf-8");
    },
    makeDir: (dirPath) => {
        fs.mkdirSync(dirPath, { recursive: true });
    },
    deleteFile: (filePath) => {
        fs.unlinkSync(filePath);
    },
    deleteFolder: (dirPath) => {
        fs.rmdirSync(dirPath);
    },
    homeFolder: () => {
        return process.env.HOME || process.env.USERPROFILE;
    },
    basePath: () => {
        return __dirname;
    },
    fileExists: (filePath) => {
        return fs.existsSync(filePath);
    },

})

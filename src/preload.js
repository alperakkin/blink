const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
    log: (message: string) => console.log(message),
});

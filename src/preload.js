const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("api", {
    log: (message) => console.log(message),
});

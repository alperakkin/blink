const { contextBridge, ipcRenderer } = require("electron");
const fs = require('fs');
const path = require("path");
const simpleGit = require("simple-git");
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

    gitBranch: async (startPath) => {

        let currentPath = startPath;

        function checkGitBranch() {
            // `.git` klasörünü kontrol et
            if (fs.existsSync(path.join(currentPath, ".git"))) {
                const git = simpleGit(currentPath);
                return git.revparse(["--abbrev-ref", "HEAD"]).then(branch => {
                    return { branch, repoPath: currentPath };
                });
            }


            const parentPath = path.dirname(currentPath);
            if (parentPath === currentPath) {

                return Promise.reject("There is no git repo!");
            } else {
                currentPath = parentPath;
                return checkGitBranch();
            }
        }

        return checkGitBranch();
    }
});




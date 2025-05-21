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
        let exists = fs.existsSync(filePath);
        source = exists == true ? fs.readFileSync(filePath, 'utf-8') : null;

        return {
            exists: exists,
            source: source
        };
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
    },
    searchFiles: (mainDir, value) => {
        function listFilesRecursive(dirPath) {
            let results = [];

            const list = fs.readdirSync(dirPath);
            list.forEach((file) => {
                const filePath = path.join(dirPath, file);
                const stat = fs.statSync(filePath);

                if (stat && stat.isDirectory()) {
                    results = results.concat(listFilesRecursive(filePath));
                } else {
                    results.push(filePath);
                }
            });

            return results;
        }

        function checkContent(paths, value) {
            let results = [];
            for (let fPath of paths) {
                const lines = fs.readFileSync(fPath, 'utf-8').split("\n");
                for (let line = 0; line < lines.length; line++) {

                    const regex = new RegExp(`${value}(.*)$`);
                    const match = lines[line].match(regex);
                    if (match)
                        results.push({
                            index: line + 1,
                            line: match[0],
                            filePath: fPath
                        })

                }
            }
            return results;

        }
        const results = listFilesRecursive(mainDir);
        return checkContent(results, value);


    }
});




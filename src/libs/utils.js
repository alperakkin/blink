import path from "path-browserify";
export const loadFiles = async (dir, setFiles) => {
    try {
        const result = await window.electron.readDirectory(dir);
        setFiles(result);
    } catch (err) {
        console.error("🚨 Folder Read Error:", err);
    }
};

export const readJSON = (filePath) => {
    const fullPath = path.join(window.electron.basePath(), filePath);
    if (!window.electron.fileExists(fullPath))
        return { cwd: window.electron.homeFolder() };
    return JSON.parse(window.electron.readFile(fullPath));
}

export const writeJSON = (filePath, content) => {
    const fullPath = path.join(window.electron.basePath(), filePath);
    window.electron.createFile(fullPath, JSON.stringify(content));
}
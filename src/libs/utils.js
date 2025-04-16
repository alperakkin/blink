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
    filePath = `settings/${filePath}.json`;
    const fullPath = path.join(window.electron.basePath(), filePath);

    if (!window.electron.fileExists(fullPath))
        return {};
    let result = window.electron.readFile(fullPath);
    if (!result.exists) return;
    return JSON.parse(result.source);
}

export const writeJSON = (filePath, content) => {
    filePath = `settings/${filePath}.json`;
    const fullPath = path.join(window.electron.basePath(), filePath);
    window.electron.createFile(fullPath, JSON.stringify(content));
}
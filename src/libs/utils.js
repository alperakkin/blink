export const loadFiles = async (dir, setFiles) => {
    try {
        const result = await window.electron.readDirectory(dir);
        setFiles(result);
    } catch (err) {
        console.error("🚨 Folder Read Error:", err);
    }
};
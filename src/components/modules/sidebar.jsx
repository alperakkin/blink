import React, { useState, useEffect } from "react";

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [path, setPath] = useState("/");
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    if (
      window.electron &&
      typeof window.electron.readDirectory === "function"
    ) {
      setIsElectron(true);
    }
  }, []);

  const loadFiles = async (dir) => {
    if (!isElectron) return;

    try {
      const result = await window.electron.readDirectory(dir);

      setFiles(result);
    } catch (err) {
      console.error("🚨 Folder Read Error:", err);
    }
  };

  return (
    <div className="file-manager">
      <input
        type="text"
        value={path}
        onChange={(e) => setPath(e.target.value)}
      />

      {!isElectron && <p>.</p>}
      <ul>
        {files.map((file) => (
          <li key={file.name}>
            {file.isDirectory ? "📁" : "📄"} {file.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileManager;

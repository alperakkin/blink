import React from "react";
import "../../public/css/sidebar.css";
import fileIcons from "../../libs/fileicons";

const FileManager = ({ files = [] }) => {
  const getFileIcon = (file) => {
    if (file.isDirectory) return fileIcons["defaultFolder"];
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    return fileIcons[ext] ? (
      <img src={fileIcons[ext]} className="w-6 h-6" />
    ) : (
      fileIcons["defaultFile"]
    );
  };
  return (
    <div className="file-manager">
      {files.length > 0 ? (
        <ul>
          {files.map((file) => (
            <li key={file.name}>
              {getFileIcon(file)} {file.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>📂 No files found</p>
      )}
    </div>
  );
};

export default FileManager;

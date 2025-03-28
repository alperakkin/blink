import React from "react";
import "../../public/css/sidebar.css";
import fileIcons from "../../libs/fileicons";

const FileManager = ({ files = [], parser }) => {
  const getFileIcon = (file) => {
    if (file.isDirectory) return fileIcons["defaultFolder"];
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    return fileIcons[ext] ? (
      <img src={fileIcons[ext]} className="w-6 h-6" />
    ) : (
      fileIcons["defaultFile"]
    );
  };

  const renderFiles = (file) => {
    return (
      <li
        className="file-item"
        key={file.name}
        onClick={() => parser.gotoFolder(file.name)}
      >
        {getFileIcon(file)} {file.name}{" "}
      </li>
    );
  };
  return (
    <div className="file-manager">
      {files.length > 0 ? (
        <ul>{files.map((file) => renderFiles(file))}</ul>
      ) : (
        <p onClick={() => parser.gotoFolder("/")}>📂</p>
      )}
    </div>
  );
};

export default FileManager;

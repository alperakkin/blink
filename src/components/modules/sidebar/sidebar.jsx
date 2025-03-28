import React from "react";
import "public/css/sidebar.css";
import fileIcons from "libs/fileicons";
import renderFolderExplorer from "./folderbrowser";

const FileManager = ({ files = [], parser }) => {
  const getFileIcon = (file) => {
    if (file.isDirectory) return fileIcons["defaultFolder"];
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    return fileIcons[ext] ? (
      <img src={fileIcons[ext]} className="file-icon" />
    ) : (
      fileIcons["defaultFile"]
    );
  };

  const renderFiles = (file) => {
    return (
      <li
        className="file-item"
        key={file.name}
        onClick={() => parser.handleCommandSubmit(`cd ${file.name}`)}
      >
        {getFileIcon(file)} {file.name}{" "}
      </li>
    );
  };
  return (
    <div className="file-manager">
      <div>{renderFolderExplorer(parser)}</div>
      <div className="file-list-container">
        {files.length > 0 ? (
          <ul className="file-list">
            {files.map((file) => renderFiles(file))}
          </ul>
        ) : (
          <p onClick={() => parser.gotoFolder("/")}></p>
        )}
      </div>
    </div>
  );
};

export default FileManager;

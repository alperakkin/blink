import React, { useState } from "react";
import "public/css/sidebar.css";
import fileIcons from "libs/fileicons";
import renderFolderExplorer from "./folderbrowser";

const FileManager = ({ files = [], parser }) => {
  const [highlightedFile, setHighlightedFile] = useState(null);
  const getFileIcon = (file) => {
    if (file.isDirectory) return fileIcons["defaultFolder"];
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    return fileIcons[ext] ? (
      <img src={fileIcons[ext]} className="file-icon" />
    ) : (
      fileIcons["defaultFile"]
    );
  };

  const handleFileAndFolders = (file) => {
    setHighlightedFile(file.name);

    if (file.isDirectory) parser.handleCommandSubmit(`cd ${file.name}`);
    else {
      parser.handleCommandSubmit(`open ${file.name}`);
    }
  };

  const renderFiles = (file) => {
    const isHighlighted = highlightedFile === file.name;
    return (
      <li
        className={`file-item ${isHighlighted ? "highlighted" : ""}`}
        key={file.name}
        onClick={() => handleFileAndFolders(file)}
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

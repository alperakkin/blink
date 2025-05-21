import React, { useState, useRef, useEffect } from "react";
import "public/css/sidebar.css";
import fileIcons from "libs/fileicons";
import renderFolderExplorer from "./folderbrowser";
import path from "path-browserify";

const FileManager = ({ files = [], parser, isSearchActive }) => {
  const [highlightedFile, setHighlightedFile] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const inputRef = useRef(null);
  useEffect(() => {
    if (!isSearchActive) {
      setSearchResults(null);
    }
    if (isSearchActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchActive]);

  const getFileIcon = (file) => {
    if (file.isDirectory)
      return <img src={fileIcons["defaultFolder"]} className="file-icon" />;
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    return fileIcons[ext] ? (
      <img src={fileIcons[ext]} className="file-icon" />
    ) : (
      <img src={fileIcons["defaultFile"]} className="file-icon" />
    );
  };

  const handleSearchResults = (e) => {
    const value = e.target.value;
    setSearchResults(window.electron.searchFiles(parser.cwd, value));
  };

  const handleFileAndFolders = (file) => {
    setHighlightedFile(file.name);
    const filePath = path.join(parser.cwd, file.name);

    if (file.isDirectory) parser.handleCommandSubmit(`cd ${file.name}`);
    else {
      parser.handleCommandSubmit(`open ${filePath}`);
    }
  };

  const openSearchResult = (file) => {
    parser.setSearchActive(null);

    let dir = path.dirname(file);
    parser.handleCommandSubmit(`cd ${dir}`);
    parser.handleCommandSubmit(`open ${file}`);
  };

  const renderFiles = (file) => {
    const isHighlighted = highlightedFile === file.name;
    return (
      <li
        className={`file-item ${isHighlighted ? "highlighted" : ""}`}
        key={file.name}
        onClick={() => handleFileAndFolders(file)}
      >
        {getFileIcon(file)}{" "}
        {<span className="file-item-text">{file.name}</span>}{" "}
      </li>
    );
  };

  const renderSearchResults = (res) => {
    const name = path.basename(res.filePath);
    const file = { name };
    return (
      <li
        className="file-item"
        key={path.basename(res.filePath) + res.index}
        onClick={() => openSearchResult(res.filePath)}
      >
        {getFileIcon(file)}{" "}
        {<span className="file-item-text">{path.basename(res.filePath)}</span>}{" "}
        <div className="search-line">{res.line}</div>
      </li>
    );
  };

  return (
    <div className="file-manager">
      <div>{renderFolderExplorer(parser)}</div>
      {isSearchActive && (
        <div className="search-container">
          <div className="search-input-container">
            <label>Search</label>
            <input
              className="search-bar"
              onChange={(e) => handleSearchResults(e)}
              ref={inputRef}
            ></input>
          </div>
          <div className="search-list-container"></div>
          <ul className="search-list">
            {searchResults &&
              searchResults.map((res) => renderSearchResults(res))}
          </ul>
        </div>
      )}

      {!isSearchActive && (
        <div className="file-list-container">
          {files.length > 0 ? (
            <ul className="file-list">
              {files.map((file) => renderFiles(file))}
            </ul>
          ) : (
            <p onClick={() => parser.gotoFolder("/")}></p>
          )}
        </div>
      )}
    </div>
  );
};

export default FileManager;

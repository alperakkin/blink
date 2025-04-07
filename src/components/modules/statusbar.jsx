import React, { useState, useEffect } from "react";
import "public/css/statusbar.css";
import folderTree from "public/icons/folder-tree.svg";
import gitIcon from "public/icons/code-branch.svg";
const StatusBar = ({ parser }) => {
  const [branch, setBranch] = useState(null);
  const gitBranch = () => {
    window.electron
      .gitBranch(parser.cwd)
      .then((result) => {
        setBranch(result.branch);
      })
      .catch((err) => setBranch(null));
  };

  useEffect(() => {
    if (parser?.cwd) {
      gitBranch();
    }
  }, [parser?.cwd]);

  return (
    <div className="status-bar">
      <div className="status-cwd">
        <img className="status-folder-tree" src={folderTree} />{" "}
        <span className="status-text">{parser?.cwd}</span>
      </div>
      {branch && (
        <div className="status-git">
          <img className="status-git-icon" src={gitIcon} alt="Git Icon" />
          <span className="status-text">{branch}</span>
        </div>
      )}
    </div>
  );
};

export default StatusBar;

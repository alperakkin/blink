import React, { useState, useEffect, useRef } from "react";
import EditorLogo from "public/image/logo.png";
import "public/css/welcome.css";
import path from "path-browserify";
const WelcomeScreen = ({ parser }) => {
  const [command, setCommand] = useState("");
  const [displayNewfile, setDisplayNewFile] = useState("none");
  const [branchInfoMap, setBranchInfoMap] = useState({});
  const isEventAdded = useRef(false);

  useEffect(() => {
    if (!parser || isEventAdded.current) return;
    const handleKeyDown = (event) => {
      if (command && event.key == "Enter") {
        setDisplayNewFile("none");
        parser.newFileOrFolder(command);
        setCommand("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    isEventAdded.current = true;

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      isEventAdded.current = false;
    };
  }, [parser, command]);

  const fetchProjectInfo = (cwd) => {
    window.electron
      .gitBranch(cwd)
      .then((result) => {
        setBranchInfoMap((prev) => ({
          ...prev,
          [cwd]: result.repoPath,
        }));
      })
      .catch(() => {
        setBranchInfoMap((prev) => ({
          ...prev,
          [cwd]: null,
        }));
      });
  };

  useEffect(() => {
    if (!parser) return;
    parser.recentFolders.forEach((cwd) => {
      if (!branchInfoMap[cwd]) {
        fetchProjectInfo(cwd);
      }
    });
  }, [parser?.recentFolders]);

  const parseInfo = (cwd) => {
    if (!cwd || branchInfoMap[cwd] == undefined)
      return <label className="project-label"></label>;
    return path.basename(branchInfoMap[cwd]);
  };
  const renderRecent = () => {
    return (
      <ul className="project-list-container">
        {parser.recentFolders.map((cwd) => (
          <li
            className="project-list"
            key={cwd}
            onClick={() => parser.gotoFolder(cwd)}
          >
            <label className="project-label">{parseInfo(cwd)}</label>
            <label className="project-path">{cwd}</label>
          </li>
        ))}
      </ul>
    );
  };
  return (
    <div className="welcome-container">
      <div className="brand-info">
        <h1 className="brand-name">Blink</h1>
        <p className="brand-description">Let's start coding..</p>
        <div className="welcome-logo">
          <img src={EditorLogo} />
        </div>
      </div>

      <div className="welcome-actions">
        <div className="new-file">
          <label
            className="new-file-label"
            onClick={() => setDisplayNewFile("block")}
          >
            New File
          </label>
          <input
            className="new-file-inp"
            type="text"
            value={command}
            style={{ display: displayNewfile }}
            onChange={(e) => setCommand(e.target.value)}
          />
        </div>

        <div className="recent-files">
          <label>Recent Projects</label>
          {parser?.recentFolders ? renderRecent() : ""}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;

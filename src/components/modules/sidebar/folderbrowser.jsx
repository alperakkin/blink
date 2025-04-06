import React from "react";
import openFolder from "public/icons/openFolder.svg";
import arrow from "public/icons/arrow.svg";

const openFileOrFolder = async (parser) => {
  const folderPath = await window.electron.selectFolder();
  parser.gotoFolder(folderPath);
};

const gotoPrevFolder = (parser) => {
  parser.gotoFolder("..");
};

const gotoNextFolder = (parser) => {
  parser.gotoFolder(parser.prevCwd);
};

const renderFolderExplorer = (parser) => {
  return (
    <div className="file-browser-panel">
      <div className="explorer">EXPLORER</div>

      <img
        className="browser-element open-folder"
        src={openFolder}
        onClick={() => openFileOrFolder(parser)}
      />

      <img
        className="browser-element prev-folder"
        src={arrow}
        onClick={() => gotoPrevFolder(parser)}
      />
      <img
        className="browser-element next-folder"
        src={arrow}
        onClick={() => gotoNextFolder(parser)}
      />
    </div>
  );
};

export default renderFolderExplorer;

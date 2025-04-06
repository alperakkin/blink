import React from "react";
import openFolderIcon from "public/icons/openFolder.svg";
import saveFileIcon from "public/icons/save.svg";
import deleteFileIcon from "public/icons/trash.svg";
import arrow from "public/icons/arrow.svg";

const openFileOrFolder = async (parser) => {
  const folderPath = await window.electron.selectFolder();
  parser.gotoFolder(folderPath);
};

const saveFile = (parser) => {
  parser.saveFile();
};

const deleteFile = (parser) => {
  parser.deleteFileOrFolder();
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
        className="browser-element save-file"
        src={saveFileIcon}
        onClick={() => saveFile(parser)}
      />
      <img
        className="browser-element open-folder"
        src={openFolderIcon}
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
      <img
        className="browser-element delete-file"
        src={deleteFileIcon}
        onClick={() => deleteFile(parser)}
      />
    </div>
  );
};

export default renderFolderExplorer;

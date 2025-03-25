import React, { useState, useEffect } from "react";

const FileManager = ({ files = [] }) => {
  return (
    <div className="file-manager">
      {files.length > 0 ? (
        <ul>
          {files.map((file) => (
            <li key={file.name}>
              {file.isDirectory ? "📁" : "📄"} {file.name}
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

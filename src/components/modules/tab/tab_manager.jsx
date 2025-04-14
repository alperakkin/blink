import React, { forwardRef } from "react";
import "public/css/tabmanager.css";

const TabManager = forwardRef(({ activeFile, parser }, ref) => {
  const tabItems = () => {
    return <div className="tab-item">{activeFile}</div>;
  };

  return (
    <div
      className="tab-container"
      style={{
        display: activeFile ? "block" : "none",
      }}
    >
      <div className="tab-viewer">{tabItems}</div>
      <div className="code-editor" ref={ref}></div>
    </div>
  );
});

export default TabManager;

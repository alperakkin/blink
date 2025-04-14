import React, { forwardRef } from "react";
import "public/css/tabmanager.css";

const TabManager = forwardRef(({ activeFile, parser }, ref) => {
  return (
    <div
      className="tab-container"
      style={{
        display: activeFile ? "block" : "none",
      }}
    >
      <div className="tab-viewer">Tabs will be rendered here</div>
      <div className="code-editor" ref={ref}></div>
    </div>
  );
});

export default TabManager;

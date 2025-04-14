import React, { forwardRef } from "react";

const TabManager = forwardRef(({ activeFile, parser }, ref) => {
  return (
    <div
      className="tab-container"
      style={{
        width: "100%",
        height: "100%",
        display: activeFile ? "block" : "none",
      }}
    >
      <div className="code-editor" ref={ref}></div>
    </div>
  );
});

export default TabManager;

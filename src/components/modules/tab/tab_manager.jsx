import React, { forwardRef } from "react";
import "public/css/tabmanager.css";

const TabManager = forwardRef(({ activeFile, parser }, ref) => {
  const renderTabs = (tab) => {
    return (
      <div
        className="tab-item"
        key={tab.ID}
        onClick={() => parser?.codeEditor.switchTab(tab.ID)}
      >
        {tab.name}
      </div>
    );
  };

  return (
    <div
      className="tab-container"
      style={{
        display: activeFile ? "block" : "none",
      }}
    >
      <div className="tab-viewer">
        {parser?.codeEditor.tabs.map((tab) => renderTabs(tab))}
      </div>
      <div className="code-editor" ref={ref}></div>
    </div>
  );
});

export default TabManager;

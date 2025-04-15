import React, { forwardRef } from "react";
import "public/css/tabmanager.css";
import xMark from "public/icons/xmark.svg";
const TabManager = forwardRef(({ activeTabID, parser }, ref) => {
  const renderTabs = (tab) => {
    return (
      <div
        className={`tab-item ${activeTabID === tab.ID ? "active" : ""}`}
        key={tab.ID}
        onClick={() => parser?.switchTab(tab.ID)}
      >
        {tab.name}
        <img
          className="close-tab-item"
          src={xMark}
          onClick={() => {
            parser.closeFile();
          }}
        />
      </div>
    );
  };

  return (
    <div
      className="tab-container"
      style={{
        display: activeTabID == null ? "none" : "block",
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

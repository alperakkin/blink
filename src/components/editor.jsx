import React, { useRef, useEffect } from "react";
import * as monaco from "monaco-editor";

const Editor = () => {
  const editorRef = useRef(null);
  self.MonacoEnvironment = {
    getWorkerUrl: function (_, label) {
      if (label === "json") {
        return "./monaco/json.worker.js";
      }
      if (label === "css" || label === "scss" || label === "less") {
        return "./monaco/css.worker.js";
      }
      if (label === "html" || label === "handlebars" || label === "razor") {
        return "./monaco/html.worker.js";
      }
      if (label === "typescript" || label === "javascript") {
        return "./monaco/ts.worker.js";
      }
      return "./monaco/editor.worker.js";
    },
  };

  useEffect(() => {
    if (!editorRef.current) return;

    const editor = monaco.editor.create(editorRef.current, {
      value: "// Write your code here",
      language: "javascript",
      theme: "vs-dark",
      automaticLayout: true,
    });

    return () => editor.dispose();
  }, []);

  return <div ref={editorRef} style={{ width: "100%", height: "500px" }} />;
};

export default Editor;

import React, { useRef, useEffect } from "react";
import * as monaco from "monaco-editor";

const Editor = () => {
    const editorRef = useRef(null);

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

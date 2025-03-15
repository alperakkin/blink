import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import * as monaco from 'monaco-editor';


const MonacoEditor = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    monaco.editor.create(editorRef.current, {
      value: 'console.log("Hello, Monaco Editor in React!");',
      language: 'javascript',
    });
  }, []);

  return <div ref={editorRef} style={{ height: '100vh' }}></div>;
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MonacoEditor />);

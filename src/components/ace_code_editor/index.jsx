// NPM PACKAGE : https://www.npmjs.com/package/react-ace-builds
// DEMO : https://manubb.github.io/react-ace-builds/
// DEMO : https://codesandbox.io/p/sandbox/react-ace-editor-32yhz?file=%2Fpackage.json%3A16%2C28
import React, { useState } from "react";
import AceEditor from "react-ace";

// Import the Ace mode for SQL, JavaScript, and Python
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-mysql";  // Import SQL mode
import "ace-builds/src-noconflict/mode-java";   // Import Java mode
import "ace-builds/src-noconflict/mode-csharp"; // Import C# mode
import "ace-builds/src-noconflict/mode-c_cpp";  // Import C/C++ mode

// Import themes
import "ace-builds/src-noconflict/theme-chaos";
// import "ace-builds/src-noconflict/theme-github";
// import "ace-builds/src-noconflict/theme-github_dark";



const AceCodeEditor = ({ mode, editorValue, handleTyping, isEditorProps=true }) => {
  return (
    
    <AceEditor
      focus
      mode={mode}
      width="100%"
      height="100%"
      theme="chaos"
      name="blah2"
      onChange={handleTyping}
      fontSize={14}
      showPrintMargin={false}
      showGutter={true}
      highlightActiveLine={true}
      value={editorValue}
      wrapEnabled={true}
      setOptions={{
        useWorker: false,
        showLineNumbers: true,
        tabSize: 2,
      }}
      editorProps={ isEditorProps ? {
        $blockScrolling: true,
        onCopy  :  ()=>{ console.error("Copying is disabled") }, 
        onPaste :  ()=>{ console.error("Pasting is disabled") }, 
      } :{}}
    />
  );
};

export default AceCodeEditor;
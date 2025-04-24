import React, { useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import AceEditor from "react-ace";
import PropTypes from "prop-types";

// Import Ace modes for different languages
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/mode-java";

// Import Ace themes (from your original theme setup)
import "ace-builds/src-noconflict/theme-chaos";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-terminal";

const CodeEditor = forwardRef(
  (
    {
      mode = "javascript",
      editorValue,
      handleTyping,
      isEditorProps = true,
      codeHints,
      theme = "terminal", // Default theme set to 'terminal' based on the first sample
      fontSize = 14,
      showPrintMargin = false,
      showGutter = true,
      highlightActiveLine = true,
      wrapEnabled = true,
      tabSize = 2,
    },
    ref
  ) => {
    // Use a ref to track the latest handleTyping function
    const handleTypingRef = useRef(handleTyping);
    
    // Update the ref whenever handleTyping changes
    useEffect(() => {
      handleTypingRef.current = handleTyping;
    }, [handleTyping]);

    // Set initial template from codeHints when mode or codeHints changes
    useEffect(() => {
      if (codeHints) {
        handleTypingRef.current(codeHints);
      }
    }, [mode, codeHints]); // Only react to mode/codeHints changes

    // Expose template reset functionality
    useImperativeHandle(ref, () => ({
      resetToTemplate: () => {
        if (codeHints) {
          handleTypingRef.current(codeHints);
        }
      },
    }));

    return (
      <div style={{ height: "100%", width: "100%" }}>
        <AceEditor
          focus
          mode={mode}
          width="100%"
          height="100%"
          theme={theme}
          name="code-editor"
          onChange={handleTyping}
          fontSize={fontSize}
          showPrintMargin={showPrintMargin}
          showGutter={showGutter}
          highlightActiveLine={highlightActiveLine}
          value={editorValue}
          wrapEnabled={wrapEnabled}
          setOptions={{
            useWorker: false,
            showLineNumbers: true,
            tabSize: tabSize,
            enableSnippets: true,
          }}
          editorProps={
            isEditorProps
              ? {
                  $blockScrolling: true,
                  onCopy: () => console.error("Copying is disabled"),
                  onPaste: () => console.error("Pasting is disabled"),
                }
              : {}
          }
        />
      </div>
    );
  }
);

// PropTypes for type checking
CodeEditor.propTypes = {
  mode: PropTypes.oneOf(["javascript", "python", "mysql", "java"]),
  editorValue: PropTypes.string.isRequired,
  handleTyping: PropTypes.func.isRequired,
  isEditorProps: PropTypes.bool,
  theme: PropTypes.oneOf(["chaos", "monokai", "github", "terminal"]),
  fontSize: PropTypes.number,
  showPrintMargin: PropTypes.bool,
  showGutter: PropTypes.bool,
  highlightActiveLine: PropTypes.bool,
  wrapEnabled: PropTypes.bool,
  tabSize: PropTypes.number,
  codeHints: PropTypes.string,
};

export default CodeEditor;
import React, { useState, useEffect } from 'react';
import { Excalidraw, Footer, Sidebar, MainMenu } from '@excalidraw/excalidraw';

const ExcalidrawCanvas = ({ setExcalidrawAPI }) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Adjust canvas size when window is resized
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const libraryItems = [
    {
      status: "published",
      id: "1",
      created: 1,
      elements: [
        {
          type: "rectangle",
          version: 1,
          id: "rect-1",
          width: 100,
          height: 100,
          x: 100,
          y: 100,
          strokeColor: "#000000",
          backgroundColor: "#ff0000",
        },
      ],
    },
    {
      status: "unpublished",
      id: "2",
      created: 2,
      elements: [
        {
          type: "ellipse",
          version: 1,
          id: "ellipse-1",
          width: 100,
          height: 100,
          x: 200,
          y: 200,
          strokeColor: "#000000",
          backgroundColor: "#00ff00",
        },
      ],
    },
  ];

  // Define the UI options for Excalidraw canvas
  const uiOptions = {
    canvasActions: {
      changeViewBackgroundColor: false,
      clearCanvas: false,
      loadScene: false,
    },
    dockedSidebarBreakpoint: 200,
  };

  return (
    <div style={{ width: '100%', height: `${windowSize.height - 20}px` }}>
      <Excalidraw
        excalidrawAPI={setExcalidrawAPI}
        theme="dark"
        renderTopRightUI={() => {
          return (
            <button
              style={{
                marginLeft: "1000rem",
              }}
            >
              Download Image
            </button>
          );
        }}
        UIOptions={uiOptions}
        initialData={{ libraryItems }}
      >
        <Footer>
          <Sidebar.Trigger name="custom" tab="one" style={{ marginLeft: "1000rem" }} />
        </Footer>
        <MainMenu>
          <MainMenu.DefaultItems.Export />
        </MainMenu>
      </Excalidraw>
    </div>
  );
};

export default ExcalidrawCanvas;

// src/components/useExportCanvas.js
import { useState } from 'react';
import { exportToCanvas } from '@excalidraw/excalidraw';

const useExportCanvas = (excalidrawAPI) => {
  const [canvasUrl, setCanvasUrl] = useState("");

  const getFullSceneDimensions = (elements) => {
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    elements.forEach((element) => {
      const { x, y, width, height } = element;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + width);
      maxY = Math.max(maxY, y + height);
    });

    return { width: maxX - minX, height: maxY - minY };
  };

  const handleExportFullSize = async () => {
    if (!excalidrawAPI) return;

    const elements = excalidrawAPI.getSceneElements();
    if (!elements || !elements.length) return;

    const { width, height } = getFullSceneDimensions(elements);

    const canvas = await exportToCanvas({
      elements,
      appState: { exportWithDarkMode: false },
      files: excalidrawAPI.getFiles(),
      getDimensions: () => ({ width, height }),
      exportPadding: 0,
    });

    const ctx = canvas.getContext("2d");
    ctx.font = "30px Arial";
    const dataUrl = canvas.toDataURL(); // Generate base64 encoded image URL
    setCanvasUrl(dataUrl);

    return dataUrl; // Return the canvas data URL
  };

  return { canvasUrl, handleExportFullSize };
};

export default useExportCanvas;

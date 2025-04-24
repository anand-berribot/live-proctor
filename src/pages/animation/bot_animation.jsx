import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";

import bot_listening from "src/assets/mastermind_animation/Listening_Transparent.webm";
import bot_speaking from "src/assets/mastermind_animation/Speaking_Transparent.webm";
import bot_thinking from "src/assets/mastermind_animation/Thinking_Transparent.webm";
import bot_berry from "src/assets/mastermind_animation/Berry_Transparent.webm";
import bot_idle from "src/assets/mastermind_animation/Idle_Transparent.webm";

const filePaths = {
  speaking: bot_speaking,
  thinking: bot_thinking,
  listening: bot_listening,
  idle: bot_idle,
  berry: bot_berry,
};

function BotAnimation({ BotState }) {
  const [videoPaths, setVideoPaths] = useState(filePaths);
  const [backgroundURL, setBackgroundURL] = useState(null);
  const [foregroundURL, setForegroundURL] = useState(null);

  useEffect(() => {
    addCache();
  }, []);

  useEffect(() => {

    const fetchFromCache = async (url) => {
      const cache = await caches.open("video-cache");
      const response = await cache.match(url);
      if (response) {
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);
        return objectURL;
      } else {
        console.log("Resource not found in cache.");
        await addCache();
        return null;
      }
    };

    const setCacheURLs = async () => {
      // console.log("--bot_state--", BotState);

      // set background glob .webm url
      if (backgroundURL == null){
        const backgroundBlobURL = await fetchFromCache(videoPaths["berry"]);
        backgroundBlobURL ? setBackgroundURL(backgroundBlobURL) : setBackgroundURL(videoPaths.berry);
        // console.log("--background_blob_url--", backgroundBlobURL);
      }
      
      // set foreground bot .webm url
      const foregroundBlobURL = await fetchFromCache(videoPaths[BotState]);
      foregroundBlobURL ? setForegroundURL(foregroundBlobURL) : setBackgroundURL(videoPaths[BotState]);
      // console.log("--foreground_blob_url--", foregroundBlobURL);
    };

    setCacheURLs();
  }, [BotState]);

  const addCache = async () => {
    const cache = await caches.open("video-cache");
    const cachePromises = Object.entries(videoPaths).map(
      async ([key, path]) => {
        const response = await cache.match(path);
        if (!response) {
          const networkResponse = await fetch(path);
          await cache.put(path, networkResponse.clone());
        }
      }
    );

    // Wait for all videos to be cached
    await Promise.all(cachePromises);
  };

  return (
    <Box
      className="video-container"
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Background Video */}
      <Box
        component="video"
        id="backgroundVideo"
        src={backgroundURL}
        muted
        loop
        autoPlay
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 1,
        }}
      />

      {/* Foreground Video */}
      <Box
        component="video"
        className="foreground-video"
        src={foregroundURL}
        muted
        loop
        autoPlay
        sx={{
          position: "absolute",
          top: "10px",
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 2,
        }}
      />
    </Box>
  );
}

export default BotAnimation;

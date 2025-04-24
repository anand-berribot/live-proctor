import { useEffect, useRef, useState } from "react";
const TEST_FILE_URL = "https://speed.cloudflare.com/__down?bytes=5000000";
const MIN_SPEED_MBPS = 8;
const CHECK_INTERVAL = 5000; // every 5 seconds
const MAX_SAMPLES = 5;
const CONSECUTIVE_FAILURES = 3;
export default function useNetworkSpeedTest() {
  const [networkSpeed, setNetworkSpeed] = useState(null);
  const [networkStatus, setNetworkStatus] = useState("checking");
  const speedSamplesRef = useRef([]);
  const testSpeed = async () => {
    const startTime = performance.now();
    try {
      const response = await fetch(TEST_FILE_URL, { cache: "no-store" });
      const blob = await response.blob();
      const endTime = performance.now();
      const durationSec = (endTime - startTime) / 1000;
      const sizeMB = blob.size / (1024 * 1024);
      const latestSpeed = sizeMB / durationSec * 8; // Mbps
      console.debug(`Speed Check @ ${new Date().toLocaleTimeString()}: ${latestSpeed.toFixed(2)} Mbps`);
      const updatedSamples = [...speedSamplesRef.current, latestSpeed].slice(-MAX_SAMPLES);
      speedSamplesRef.current = updatedSamples;
      setNetworkSpeed(latestSpeed);
      const avgSpeed = updatedSamples.reduce((a, b) => a + b, 0) / updatedSamples.length;
      const lowStreak = updatedSamples.slice(-CONSECUTIVE_FAILURES).every(s => s < MIN_SPEED_MBPS);
      if (avgSpeed < MIN_SPEED_MBPS || lowStreak) {
        setNetworkStatus("not-good");
      } else {
        setNetworkStatus("good");
      }
    } catch (err) {
      console.error("Speed test failed", err);
      setNetworkStatus("not-good");
    }
  };
  useEffect(() => {
    const intervalId = setInterval(testSpeed, CHECK_INTERVAL);
    return () => clearInterval(intervalId);
  }, []);
  return { networkSpeed, networkStatus };
}
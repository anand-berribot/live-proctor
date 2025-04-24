/**
 * src/utils/audioUtils.js
 * Audio playback.
 * 
 * created by Lynchee on 7/16/23
 */


const unlockAudioContext = (audioContext) => {
  if (audioContext.state === 'suspended') {
    const unlock = function () {
      audioContext.resume().then(function () {
        document.body.removeEventListener('touchstart', unlock);
        document.body.removeEventListener('touchend', unlock);
      });
    };
    document.body.addEventListener('touchstart', unlock, false);
    document.body.addEventListener('touchend', unlock, false);
  }
};

// play a single audio chunk
const playAudio = (audioContextRef, audioPlayer, url) => {
  return new Promise((resolve, reject) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        unlockAudioContext(audioContextRef.current);
      }

      // This makes sure audio keeps playing even in background
      audioPlayer.current.src = url;
      audioPlayer.current.crossOrigin = "anonymous";
      audioPlayer.current.muted = true;

      audioPlayer.current.play()
        .then(() => {
          audioPlayer.current.muted = false;
          audioPlayer.current.onended = () => {
            resolve();
          };
        })
        .catch(error => {
          reject(error);
        });
    } catch (e) {
      reject(e);
    }
  });
};



// Function to handle playback errors and trigger Slack alert
function handlePlaybackError(error) {
  let errorMessage;
  let errorName;

  if (error.name === 'NotSupportedError') {
    errorMessage = `Playback failed because: ${error}. Please check https://elevenlabs.io/subscription if you have enough characters left.`;
    errorName = 'subscriptionError';
  } else {
    errorMessage = `Playback failed because: ${error}`;
    errorName = 'Playback';
  }

  const API_URL = process.env.REACT_APP_API_URL;

  fetch(`${API_URL}slack-alert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error_message: errorMessage })
  })
    .then(response => {
      if (!response.ok) throw new Error('Failed to trigger Slack alert');
      console.log('Slack alert triggered successfully');
    })
    .catch(err => {
      console.error('Error triggering Slack alert:', err);
    });

  if (errorName === 'subscriptionError') {
    sessionStorage.setItem('mas_block_page', 'Oops seems like a disruption, Do not worry take a small 10 minutes break, Refresh and start over with the same link again.');
  }
}



// play all audio chunks
export const playAudios = async (audioContextRef, audioPlayer, audioQueue, questionCount, errorCallback) => {
  try {
    while (audioQueue.current.length > 0) {
      const data = audioQueue.current[0];
      const blob = new Blob([data], { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(blob);
      console.log(audioUrl);

      await new Promise((resolve, reject) => {
        playAudio(audioContextRef, audioPlayer, audioUrl)
          .then(() => {
            questionCount.current += 1;
            console.debug(`Audio played successfully. Question count is now ----> : ${questionCount.current}`);
            resolve();
          })
          .catch(error => {
            handlePlaybackError(error); // Send Slack alert
            reject(error);
          });
      });

      audioQueue.current.shift();
    }
  } catch (error) {
    console.error(`Error during audio playback: ${error}`);
    if (typeof errorCallback === 'function') {
      errorCallback(error);
    }
  }
};
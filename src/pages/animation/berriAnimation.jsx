import React, { useEffect, useRef, useState } from 'react';
import bot_speaking from 'src/assets/mastermind_animation/Speaking_Transparent.webm';
import bot_thinking from 'src/assets/mastermind_animation/Thinking_Transparent.webm';
import bot_listening from 'src/assets/mastermind_animation/Listening_Transparent.webm';
import bot_idle from 'src/assets/mastermind_animation/Idle_Transparent.webm';
import bot_berry from 'src/assets/mastermind_animation/Berry_Transparent.webm';


function VideoPlayer({ isVisibleCodeCompiler, isPlaying, BotState, CameraRequired = true }) {
  let IsBerry = true;
  const isBotIdle = sessionStorage.getItem('mas_bot_idle') === 'true';


  // Style for the background video when IsBerry is true
  const backgroundVideoStyle = {
    width: CameraRequired === false ? '66%' : isVisibleCodeCompiler ? '65%' : '65%',
    height: isVisibleCodeCompiler ? '60%' : '60%',
    objectFit: isVisibleCodeCompiler ? 'contain' : 'contain',
    position: 'absolute',
    top: '0',
    left: isVisibleCodeCompiler ? '2.5%' : '2.5%'
  };

  const videoStyle = {
    width: '100%',
    height: '80%',
    objectFit: 'cover',
    position: 'absolute'
  }

  const codingQuestionStyle = {
    position: 'absolute',
    top: isVisibleCodeCompiler ? '-10px' : '10px',
    left: isVisibleCodeCompiler ? '18%' : '18%',
    width: IsBerry ? '90%' : '90%',
    height: isVisibleCodeCompiler ? '67%' : '77%',
    overflow: 'hidden'
  }


  // Styles for animation that weren't clearly placed in your original snippet
  const animationStyles = {
    // marginTop: isVisibleCodeCompiler ? 0 : '-1%', // Make sure units are specified for margin-top
    // marginLeft: isVisibleCodeCompiler ? 0 : '-6%',
    left: CameraRequired === false ? '5.5%' : '5.0%',
    top: isVisibleCodeCompiler ? '3%' : '3%',
    transition: 'opacity 0.5s ease-in-out',
    opacity: 1,
    width: isVisibleCodeCompiler ? '55%' : '60%',
    height: isVisibleCodeCompiler ? '60%' : '60%',
    objectFit: 'contain',
    borderRadius: '8px'
  };


  const animationStyles1 = {
    left: isVisibleCodeCompiler ? '12%' : '-25%',
    top: isVisibleCodeCompiler ? '-30%' : '-32%',
    transition: 'opacity 0.5s ease-in-out',
    opacity: 1,
    width: isVisibleCodeCompiler ? '100%' : '150%',
    height: isVisibleCodeCompiler ? '100%' : '150%',
    objectFit: 'contain',
    borderRadius: '8px'
  };
  const videoStyle1 = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute'
  }
  const video = false;

  const typeWebm = isVisibleCodeCompiler ? {
    position: 'absolute',
    width: '13rem',
    height: '13rem',
    top: isBotIdle ? '-10rem' : '-16rem',
    left: '-2rem'
  } : {
    position: 'absolute',
    width: '28rem',
    height: '25rem',
    top: isBotIdle ? '-10rem' : '-16rem',
    left: '-14rem'
  }
  const typeVideo = isVisibleCodeCompiler ? {
    position: 'absolute',
    width: '20rem',
    height: '20rem',
    top: '-21rem',
    left: '-4rem'
  } : {
    position: 'absolute',
    width: '50rem',
    height: '50rem',
    top: isBotIdle ? '-21rem' : '-29rem',
    left: '-24rem'
  }
  // const videoRef = useRef(null);

  // useEffect(() => {
  //   if (videoRef.current) {
  //     videoRef.current.playbackRate = 3.0; // Double the playback speed
  //   }
  // }, []);
  // console.log("BotState", videoRef.current.playbackRate);
  return (
    <>
      {video ?
        <video
          //  ref={videoRef}
          playbackRate={BotState === 'speaking' && 3.0}
          // src={BotState === 'idle' ? '/assets/animation/idle.mp4' :
          //   BotState === 'speaking' ? '/assets/animation/speech.mp4' :
          //     BotState === 'thinking' ? '/assets/animation/thinking.mp4' :
          //       BotState === 'listening' ? '/assets/animation/listening.mp4' : '/assets/animation/idle.mp4'}
          src={BotState === 'idle' ? '/assets/animation/Idle.webm' :
            BotState === 'speaking' ? '/assets/animation/Speaking.webm' :
              BotState === 'thinking' ? '/assets/animation/Thinking.webm' :
                BotState === 'listening' ? '/assets/animation/Listening.webm' : '/assets/animation/Idle.webm'}
          muted loop autoPlay
          style={typeWebm}
        />
        :
        <div className="video-container" style={IsBerry ? codingQuestionStyle : {}}>
          {IsBerry && <video id="backgroundVideo" src={bot_berry} muted loop autoPlay style={backgroundVideoStyle}></video>}
          <video src={BotState === 'idle' ? bot_idle :
            BotState === 'speaking' ? bot_speaking :
              BotState === 'thinking' ? bot_thinking :
                BotState === 'listening' ? bot_listening : bot_speaking}
            muted loop autoPlay
            className={`foreground-video ${!IsBerry ? 'hidden' : ''}`}
            style={IsBerry ? { ...videoStyle, ...animationStyles } : { ...videoStyle1, ...animationStyles1 }}
          ></video>
        </div >
      }
    </>

  );
}

export default VideoPlayer;
import { useEffect, useRef, useState } from "react";

const Player = () => {
  const [audioSource, setAudioSource] = useState(
    "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3"
  );
  const [audio] = useState(new Audio(audioSource));
  const [audioIsPlaying, setAudioIsPlaying] = useState(false);
  const [audioSourceIsChanged, setAudioSourceIsChanged] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const prevAudioSource = useRef(audioSource);

  useEffect(() => {
    audio.addEventListener("play", () => setAudioIsPlaying(true));
    audio.addEventListener("pause", () => setAudioIsPlaying(false));
    audio.addEventListener("loadeddata", () => setDuration(audio.duration));
    audio.addEventListener("ended", () => setAudioIsPlaying(false));
    audio.addEventListener("timeupdate", () =>
      setCurrentTime(audio.currentTime)
    );

    audio.addEventListener("abort", () => console.log("abort"));
    audio.addEventListener("canplay", () => console.log("canplay"));
    audio.addEventListener("canplaythrough", () =>
      console.log("canplaythrough")
    );
    audio.addEventListener("durationchange", () =>
      console.log("durationchange")
    );
    audio.addEventListener("emptied", () => console.log("emptied"));
    audio.addEventListener("ended", () => console.log("ended"));
    audio.addEventListener("error", () => console.log("error"));
    audio.addEventListener("loadeddata", () => console.log("loadeddata"));
    audio.addEventListener("loadedmetadata", () =>
      console.log("loadedmetadata")
    );
    audio.addEventListener("loadstart", () => console.log("loadstart"));
    audio.addEventListener("pause", () => console.log("pause"));
    audio.addEventListener("play", () => console.log("play"));
    audio.addEventListener("playing", () => console.log("playing"));
    audio.addEventListener("progress", () => console.log("progress"));
    audio.addEventListener("ratechange", () => console.log("ratechange"));
    audio.addEventListener("seeked", () => console.log("seeked"));
    audio.addEventListener("seeking", () => console.log("seeking"));
    audio.addEventListener("stalled", () => console.log("stalled"));
    audio.addEventListener("suspend", () => console.log("suspend"));
    audio.addEventListener("timeupdate", () => console.log("timeupdate"));
    audio.addEventListener("volumechange", () => console.log("volumechange"));
    audio.addEventListener("waiting", () => console.log("waiting"));

    return () => {
      audio.removeEventListener("loadeddata", () =>
        setDuration(audio.duration)
      );
      audio.removeEventListener("ended", () => setAudioIsPlaying(false));
      audio.removeEventListener("timeupdate", () =>
        setCurrentTime(audio.currentTime)
      );
    };
  }, [audio]);

  useEffect(() => {
    if (audioIsPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [audioIsPlaying, audio]);

  useEffect(() => {
    if (audioSourceIsChanged) {
      setAudioIsPlaying(true);
      setAudioSourceIsChanged(false);
    }
  }, [audioSourceIsChanged]);

  useEffect(() => {
    if (audioSource !== prevAudioSource.current) {
      setAudioIsPlaying(false);
      audio.setAttribute("src", audioSource);
      setAudioSourceIsChanged(true);
    }
  }, [audio, audioSource]);

  const handleAudioPlay = () => {
    setAudioIsPlaying(true);
  };

  const handleAudioPaused = () => {
    setAudioIsPlaying(false);
  };

  const handlePlayNext = () => {
    prevAudioSource.current = audioSource;
    setAudioSource(
      "https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_5MG.mp3"
    );
  };

  const handlePlayPrev = () => {
    let prev = audioSource;
    setAudioSource(prevAudioSource.current);
    prevAudioSource.current = prev;
  };
  return (
    <div>
      <h1>Player</h1>
      <h2>Audio is {audioIsPlaying ? "PLAY" : "PAUSED"}</h2>

      <h2>
        Current time {currentTime} / {duration}
      </h2>
      <button onClick={handlePlayPrev}>PREV</button>
      <button onClick={() => (audio.currentTime -= 5)}>{"<<"}</button>
      <button onClick={handleAudioPlay}>PLAY</button>
      <button onClick={handleAudioPaused}>PAUSE</button>
      <button onClick={() => (audio.currentTime += 5)}>{">>"}</button>
      <button onClick={handlePlayNext}>NEXT</button>
      {/* <button onClick={() => audio.setAttribute("src", "/music.mp3")}> */}
      <button onClick={() => (audio.src = "/music.mp3")}>TEST</button>

      <div
        style={{
          width: "500px",
          height: "20px",
          backgroundColor: "gray",
          border: "1px solid black",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            height: "100%",
            backgroundColor: "red",
            width: `${Math.round((currentTime * 100) / duration)}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default Player;

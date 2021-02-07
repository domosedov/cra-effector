import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";

const usePlayer = () => {
  const [source, setSource] = useState("");
  const ref = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const play = useCallback(() => {
    if (ref.current) {
      ref.current.play();
    }
  }, []);

  const pause = useCallback(() => {
    if (ref.current) {
      ref.current.pause();
    }
  }, []);

  // const changeSource = useCallback(
  //   (source: string) => {
  //     setSource((_) => source);
  //   },
  //   [setSource]
  // );

  const changeSource = useCallback((source: string) => {
    if (ref.current) {
      ref.current.setAttribute("src", source);
    }
  }, []);

  const changeVolume = useCallback((volume: number) => {
    if (ref.current) {
      if (volume >= 1) {
        ref.current.volume = 1;
      } else if (volume <= 0) {
        ref.current.volume = 0;
      } else {
        ref.current.volume = volume;
      }
    }
  }, []);

  const handleDurationChange = useCallback(() => {
    if (ref.current) {
      setDuration(() => ref.current!.duration);
    }
    console.log("DURATION CHANGE");
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (ref.current) {
      setCurrentTime(() => ref.current!.currentTime);
    }
    console.log("TIME UPDATE");
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    console.log("pause");
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    console.log("play");
  }, []);

  const handleVolumeChange = useCallback(() => {
    if (ref.current) {
      setVolume(() => ref.current!.volume);
    }
    console.log("VOLUME CHANGE");
  }, []);

  const handleLoadStart = useCallback((evt: Event) => {
    console.log("LOAD START", ref.current?.buffered);
  }, []);

  const handleProgress = useCallback((evt: Event) => {
    console.log("PROGRESS", ref.current?.playbackRate);
  }, []);

  useEffect(() => {
    if (ref.current && ref.current instanceof HTMLAudioElement) {
      ref.current.addEventListener("abort", () => console.log("abort"));
      ref.current.addEventListener("canplay", (evt) =>
        console.log("canplay", evt)
      );
      ref.current.addEventListener("canplaythrough", (evt) => {
        console.log("canplaythrough", evt);
      });
      ref.current.addEventListener("durationchange", handleDurationChange);
      ref.current.addEventListener("emptied", () => console.log("emptied"));
      ref.current.addEventListener("ended", (evt) => console.log("ended", evt));
      ref.current.addEventListener("error", () => console.log("error"));
      ref.current.addEventListener("loadeddata", (evt) =>
        console.log("loadeddata", evt)
      );
      ref.current.addEventListener("loadedmetadata", () =>
        console.log("loadedmetadata")
      );
      ref.current.addEventListener("loadstart", handleLoadStart);
      ref.current.addEventListener("pause", handlePause);
      ref.current.addEventListener("play", handlePlay);
      ref.current.addEventListener("playing", () => {
        console.log("playing");
      });
      ref.current.addEventListener("progress", handleProgress);
      ref.current.addEventListener("ratechange", () =>
        console.log("ratechange")
      );
      ref.current.addEventListener("seeked", () => console.log("seeked"));
      ref.current.addEventListener("seeking", () => console.log("seeking"));
      ref.current.addEventListener("stalled", () => console.log("stalled"));
      ref.current.addEventListener("suspend", () => console.log("suspend"));
      ref.current.addEventListener("timeupdate", handleTimeUpdate);
      ref.current.addEventListener("volumechange", handleVolumeChange);
      ref.current.addEventListener("waiting", () => console.log("waiting"));
    }
  }, [
    handleDurationChange,
    handleLoadStart,
    handlePause,
    handlePlay,
    handleProgress,
    handleTimeUpdate,
    handleVolumeChange,
    ref,
  ]);

  return {
    ref,
    source,
    currentTime,
    duration,
    isPlaying,
    changeSource,
    changeVolume,
    play,
    pause,
  };
};

export default usePlayer;

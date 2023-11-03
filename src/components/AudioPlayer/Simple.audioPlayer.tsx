import { formatSecondsToDuration } from "@/lib/utils/durationUtils";
import {
  Box,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";
import { AudioFile } from "@prisma/client";
import React, { useEffect, useRef, useState } from "react";
import { MdGraphicEq } from "react-icons/md";

const SimpleAudioPlayer = ({
  audioFile,
  audioRef,
  setIsPlaying,
  volume,
  muteVolume,
  externalProgress,
  setExternalProgress,
}: {
  volume: number;
  muteVolume: boolean;
  audioFile: AudioFile;
  audioRef: React.RefObject<HTMLAudioElement>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  externalProgress?: number;
  setExternalProgress?: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [progressInSeconds, setProgressInSeconds] = useState(0);
  /* const audioRef = useRef<HTMLAudioElement>(null) */
  const progressBarRef = useRef<HTMLInputElement>(null);

  const handleProgressBarChange = (e: number) => {
    setExternalProgress ? setExternalProgress(e) : setProgressInSeconds(e);
    if (!audioRef.current) return;
    const newTime = isFinite(e) ? e : 0;
    audioRef.current.currentTime = newTime;
  };

  const onPlaybackEnded = () => {
    if (!audioRef.current || !progressBarRef.current) return;
    setExternalProgress ? setExternalProgress(0) : setProgressInSeconds(0);
    setIsPlaying(false);
  };
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume / 100;
    audioRef.current.muted = muteVolume;
  }, [volume, audioRef, muteVolume]);
  return (
    <div>
      <audio
        style={{ display: "none" }}
        ref={audioRef}
        src={audioFile.url}
        controls
        preload="metadata"
        muted={muteVolume}
        onEnded={onPlaybackEnded}
        onTimeUpdate={(e) => {
          setExternalProgress
            ? setExternalProgress(e.currentTarget.currentTime)
            : setProgressInSeconds(e.currentTarget.currentTime);
        }}
      />
      <Flex w="full" alignItems={"center"} direction={"column"} gap={"10px"}>
        {/*  Controls */}

        {/* Progress bar */}
        <Flex alignItems={"center"} w="full" gap={"10px"}>
          <Text>
            {formatSecondsToDuration(externalProgress ?? progressInSeconds)}
          </Text>
          <Slider
            ref={progressBarRef}
            max={Math.floor(audioFile.duration)}
            onChange={handleProgressBarChange}
            aria-label="Progress bar"
            value={externalProgress ?? progressInSeconds}
            defaultValue={0}
            role="group"
          >
            <SliderTrack bg="red.100">
              <SliderFilledTrack bg="brand.600" />
            </SliderTrack>
            <SliderThumb _focus={{ boxShadow: "none" }} boxSize={7}>
              <Box color={"brand.500"} as={MdGraphicEq} boxSize={7} />
            </SliderThumb>
          </Slider>
          <Text>{formatSecondsToDuration(audioFile.duration)}</Text>
        </Flex>
      </Flex>
    </div>
  );
};

export default SimpleAudioPlayer;

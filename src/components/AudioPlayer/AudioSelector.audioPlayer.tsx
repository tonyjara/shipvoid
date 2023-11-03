import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Checkbox,
  Flex,
  Icon,
  IconButton,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Marquee from "react-fast-marquee";
import WaveSurfer from "wavesurfer.js";
import { trpcClient } from "@/utils/api";
import { TbPlayerPause, TbPlayerPlay } from "react-icons/tb";
import AreYouSureButton from "../Buttons/AreYouSure.button";
import { handleUseMutationAlerts } from "../Alerts/MyToast";
import { AudioFile } from "@prisma/client";
import axios from "axios";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  IoMdVolumeHigh,
  IoMdVolumeLow,
  IoMdVolumeMute,
  IoMdVolumeOff,
} from "react-icons/io";
import SimpleAudioPlayer from "./Simple.audioPlayer";

// NOTE: Chrome blocked autoplay before user interacts with the page and there's a running issue on wavesurfer
export default function AudioSelectorAudioPlayer({
  audioFile,
}: {
  audioFile: AudioFile;
}) {
  //states
  const context = trpcClient.useContext();
  const [volume, setVolume] = useState(100);
  const [hadCorsError, setHadCorsError] = useState(false);
  const [muteVolume, setMuteVolume] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  //refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const wsContainerRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WaveSurfer | null>(null);

  //db calls
  const trpcContext = trpcClient.useContext();
  const { mutate: updatePeaks } = trpcClient.audioFiles.updatePeaks.useMutation(
    {
      onSuccess: () => {
        trpcContext.audioFiles.invalidate();
      },
    },
  );

  const { mutate: deleteAudioFile } =
    trpcClient.audioFiles.deleteAudioFile.useMutation(
      handleUseMutationAlerts({
        successText: "Audio file deleted",
        callback: () => {
          context.audioFiles.invalidate();
        },
      }),
    );

  useEffect(() => {
    if (!wsContainerRef.current) return;

    // Make a fetch to the url and check if it fails because of cors
    ws.current = WaveSurfer.create({
      container: wsContainerRef.current,
      dragToSeek: true,
      barWidth: 3,
      autoplay: false,
      cursorWidth: 2,
      height: 50,
      hideScrollbar: true,
      backend: "MediaElement",
    });
    //Loading manually because of CORS, this allows us to manage errors. If CORS fails, we use the regular player
    //NOTE: Not having peaks makes CORS fail
    ws.current
      .load(
        audioFile.url,
        audioFile.peaks.length ? (audioFile.peaks as any) : undefined,
        audioFile.duration,
      )
      .then(() => {})
      .catch((e) => {
        console.error("audio selector player load error ", e.message);
        setHadCorsError(true);
      });

    ws.current.on("redraw", function () {
      try {
        if (!ws.current || audioFile.peaks.length > 0) return;

        const peaks = ws.current.exportPeaks({
          channels: 1,
          maxLength: audioFile.duration,
        });

        if (!peaks[0]) return;
        updatePeaks({ peaks: peaks[0], audioFileId: audioFile.id });
        setHadCorsError(false);
      } catch (e) {
        console.error(e);
      }
    });

    ws.current.on("finish", function () {
      if (!ws.current) return;
      ws.current.seekTo(0);
      setIsPlaying(false);
    });

    return () => {
      ws.current?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioFile.id]);

  //controls
  const togglePlayPause = () => {
    if (isPlaying) {
      ws.current?.pause();
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      ws.current?.play();
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  // Volume slider
  useEffect(() => {
    if (!ws.current) return;
    if (muteVolume) return ws.current.setVolume(0);
    ws.current.setVolume(volume / 100);
  }, [volume, muteVolume]);

  const handleVolumeSliderIcon = () => {
    if (muteVolume) return IoMdVolumeOff;
    if (volume > 50) return IoMdVolumeHigh;
    if (volume > 0) return IoMdVolumeLow;
    return IoMdVolumeMute;
  };

  const handleDeleteAudioFile = async () => {
    const req = await axios("/api/get-connection-string");
    const { connectionString } = req.data;

    deleteAudioFile({
      blobName: audioFile.blobName,
      id: audioFile.id,
      connectionString,
    });
  };

  const formatTime = (time: number) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const seconds = Math.floor(time % 60);
      const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
      return `${formatMinutes}:${formatSeconds}`;
    }
    return "00:00";
  };

  return (
    <Flex width="100%" flexDir={"column"}>
      <Box
        maxW={"220px"}
        width={"max-content"}
        backgroundColor={"gray.100"}
        _dark={{ backgroundColor: "gray.700" }}
        position={"relative"}
        top="10px"
        p={"5px"}
        borderRadius={"md"}
        zIndex={5}
      >
        <Text whiteSpace={"nowrap"} px={"10px"} fontWeight={"bold"}>
          {audioFile.name.length > 24
            ? audioFile.name.slice(0, 24) + "..."
            : audioFile.name}
        </Text>
      </Box>
      {/* INFO: Display loading when generating waveform if it didn't error */}
      {!audioFile.peaks.length && !hadCorsError && (
        <Flex mt={"20px"} alignItems={"center"} gap={"20px"}>
          <Spinner />

          <Marquee>
            Generating audio waveform... This might take a minute depending on
            your audio... Please refresh the browser if it hangs for too long...
          </Marquee>
        </Flex>
      )}
      {/* INFO: WAVE SURFER CONTAINER */}
      <div ref={wsContainerRef}></div>
      {hadCorsError && (
        <SimpleAudioPlayer
          volume={volume}
          muteVolume={muteVolume}
          setIsPlaying={setIsPlaying}
          audioRef={audioRef}
          audioFile={audioFile}
        />
      )}

      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        gap={"20px"}
        mt={"10px"}
      >
        <IconButton
          aria-label="Play/Pause"
          _hover={{ color: "brand.500" }}
          borderRadius={"full"}
          size={"sm"}
          icon={
            isPlaying ? (
              <TbPlayerPause style={{ fontSize: "20px" }} />
            ) : (
              <TbPlayerPlay style={{ fontSize: "20px" }} />
            )
          }
          cursor={"pointer"}
          onClick={togglePlayPause}
        />

        {/*INFO: VOLUME */}
        <Flex w="full" justifyContent={"end"} height={"auto"} gap={"15px"}>
          <Slider
            maxW="150px"
            hideBelow={"lg"}
            opacity="0"
            value={volume}
            onChange={(e) => setVolume(e)}
            _hover={{
              opacity: 1,
            }}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb boxSize={5} />
          </Slider>
          <Icon
            cursor={"pointer"}
            onClick={() => setMuteVolume(!muteVolume)}
            fontSize={"3xl"}
            as={handleVolumeSliderIcon()}
          />
        </Flex>
        <Text>{formatTime(audioFile.duration)}</Text>
        <AreYouSureButton
          title={"Delete audio file"}
          modalContent={
            "Are you sure you want to delete this audio file? This action cannot be undone."
          }
          confirmAction={handleDeleteAudioFile}
          confirmButtonText={"Delete"}
          customButton={
            <IconButton
              size={"sm"}
              aria-label="delete audio button"
              icon={<DeleteIcon />}
            />
          }
        />
      </Flex>
    </Flex>
  );
}

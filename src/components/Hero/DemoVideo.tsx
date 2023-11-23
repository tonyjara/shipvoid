import { Flex, Heading } from "@chakra-ui/react";
import React from "react";
import ReactPlayer from "react-player";
import NoSsr from "../NoSsr";

const DemoVideo = ({ videoUrl }: { videoUrl: string }) => {
  return (
    <Flex
      id="demo"
      gap={"20px"}
      w="full"
      flexDir={"column"}
      align="center"
      mb={"20px"}
    >
      <Heading>Watch our demo:</Heading>
      <NoSsr>
        <ReactPlayer
          url={videoUrl}
          className="react-player"
          width="100%"
          controls
        />
      </NoSsr>
    </Flex>
  );
};

export default DemoVideo;

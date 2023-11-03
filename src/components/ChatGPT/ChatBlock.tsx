import { CopyIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Flex,
  IconButton,
  SkeletonText,
  Text,
  useClipboard,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { SiOpenai } from "react-icons/si";
import { myToast } from "../Alerts/MyToast";
import { UseFormSetValue, UseFormGetValues } from "react-hook-form";
import { Scribe } from "@prisma/client";
type ChatGPTAgent = "user" | "system" | "assistant";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
  imageUrl?: string | null;
  setValue?: UseFormSetValue<Scribe>;
  getValues?: UseFormGetValues<Scribe>;
}

// loading placeholder animation for the chat line
export const LoadingChatLine = () => {
  const assistantBg = useColorModeValue("white", "gray.600");
  return (
    <Box backgroundColor={assistantBg}>
      <Flex gap={"10px"} alignItems={"center"} p="10px">
        <Box>
          <IconButton
            cursor={"auto"}
            pointerEvents={"none"}
            aria-label="Open Ai logo"
            icon={<SiOpenai />}
          />
        </Box>
        <Box w="100%">
          <SkeletonText noOfLines={3} spacing="3" skeletonHeight="2" />
        </Box>{" "}
      </Flex>
    </Box>
  );
};

export function ChatBlock({
  role = "assistant",
  content,
  imageUrl,
  setValue,
  getValues,
}: ChatGPTMessage) {
  const isAssistant = role === "assistant";
  const [showToolbar, setShowToolbar] = useState(false);
  const [expandText, setExpandText] = useState(isAssistant ? true : false);
  const { onCopy } = useClipboard(content);
  const assistantBg = useColorModeValue("white", "gray.600");
  const userBg = useColorModeValue("gray.100", "gray.700");
  const toolbarBg = useColorModeValue("gray.300", "gray.800");

  if (!content) {
    return null;
  }
  const handleCopy = () => {
    myToast.success("Copied to clipboard");
    onCopy();
  };
  const handleAddToScribe = () => {
    if (!setValue || !getValues) return;
    const scribe = getValues("userContent");

    //Insert at the bottom of the scribe
    setValue("userContent", scribe + content);
  };

  return (
    <Box
      /* p="10px" */
      onMouseEnter={() => !showToolbar && setShowToolbar(true)}
      onMouseLeave={() => showToolbar && setShowToolbar(false)}
      backgroundColor={role === "assistant" ? assistantBg : userBg}
    >
      <Flex
        /* p="10px" */
        display={showToolbar ? "flex" : "none"}
        right={"0"}
        marginBottom={"-57px"}
        marginTop={"5px"}
        justifyContent="end"
        gap={"20px"}
        alignItems={"center"}
        w="100%"
      >
        <Box
          borderRadius={"md"}
          display={"flex"}
          justifyContent={"end"}
          gap={"20px"}
          alignItems={"center"}
          zIndex={9999999}
          p="10px"
          /* w="85px" */
          backgroundColor={toolbarBg}
        >
          <Button onClick={handleAddToScribe} size={"sm"}>
            Add to scribe
          </Button>
          <CopyIcon
            _hover={{ opacity: "0.6" }}
            cursor={"pointer"}
            onClick={handleCopy}
          />
          <Checkbox
            isIndeterminate={!expandText}
            defaultChecked={false}
            onChange={() => setExpandText(!expandText)}
            size={"lg"}
          />
        </Box>
      </Flex>
      <Flex gap={"10px"} alignItems={"center"} p="10px">
        <Box>
          {isAssistant ? (
            <IconButton
              cursor={"auto"}
              pointerEvents={"none"}
              aria-label="Open Ai logo"
              icon={<SiOpenai />}
            />
          ) : (
            <Avatar size={"sm"} src={imageUrl ?? undefined} />
          )}
        </Box>
        <Text>
          {(!expandText ? content.substring(0, 150) : content)
            .split("\n")
            .map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          {content.length > 150 && !expandText && (
            <span
              style={{ cursor: "pointer" }}
              onClick={() => setExpandText(!expandText)}
            >
              ... View More
            </span>
          )}
        </Text>
      </Flex>
    </Box>
  );
}

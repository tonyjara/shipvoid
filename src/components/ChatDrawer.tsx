import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  Icon,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { SiOpenai } from "react-icons/si";
import { ChatGPTInputTextArea } from "./ChatGPT/ChatGPTInput.textArea";
import { trpcClient } from "@/utils/api";
import { handleUseMutationAlerts } from "./Alerts/MyToast";
import { UseFormGetValues, UseFormSetValue } from "react-hook-form";
import { ScribePageType } from "@/pageContainers/Scribes/Scribes.types";
import { ChatGPTMessage } from "./ChatGPT/ChatBlock";

// default first message to display in UI (not necessary to define the prompt)
export const initialMessages: ChatGPTMessage[] = [
  {
    role: "assistant",
    content: "Hi! I can assist you with generating the summary, and show notes",
  },
];
const ChatDrawer = ({
  scribe,
  setValue,
  getValues,
}: {
  scribe: ScribePageType;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
}) => {
  const context = trpcClient.useContext();
  const [showButtonText, setShowButtonText] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatGPTMessage[]>(initialMessages);
  const toolbarBg = useColorModeValue("brand.700", "gray.800");

  const { isOpen, onToggle, onClose } = useDisclosure();

  const { mutate: clearHistory } =
    trpcClient.chatGPT.clearScribeChat.useMutation(
      handleUseMutationAlerts({
        successText: "Chat history cleared",
        callback: () => {
          context.chatGPT.invalidate();
          setMessages(initialMessages);
        },
      }),
    );
  const handleCopyTranscription = () => {
    if (!scribe?.transcription.length) return;
    setInput((x) => x + scribe.transcription);
  };

  const handleCopyScribe = () => {
    if (!scribe?.userContent.length) return;
    setInput((x) => x + scribe.userContent);
  };

  const handleClearHistory = () => {
    clearHistory({ scribeId: scribe.id });
  };

  return (
    <div>
      <Button
        borderLeftRadius={"full"}
        borderRightRadius={"none"}
        position={"fixed"}
        right={"0"}
        zIndex={"10"}
        bottom={"100"}
        onClick={onToggle}
        backgroundColor={"orange.400"}
        leftIcon={<SiOpenai />}
        onMouseEnter={() => setShowButtonText(true)}
        onMouseLeave={() => setShowButtonText(false)}
        _hover={{ backgroundColor: "orange.300" }}
      >
        {showButtonText && "Chat GPT"}
      </Button>
      <Drawer
        size={{ base: "full", md: "md" }}
        placement={"right"}
        onClose={onClose}
        isOpen={isOpen}
      >
        <DrawerContent>
          <DrawerHeader alignItems={"center"} borderBottomWidth="1px">
            <Icon mr={"10px"} as={SiOpenai} w={6} h={6} />
            Chat GPT
            <DrawerCloseButton />
          </DrawerHeader>

          <Box
            display={"flex"}
            gap={"10px"}
            backgroundColor={toolbarBg}
            p="10px"
          >
            <Button
              onClick={handleCopyTranscription}
              size={"sm"}
              alignSelf={"start"}
            >
              Copy Transcription
            </Button>

            <Button onClick={handleCopyScribe} size={"sm"} alignSelf={"start"}>
              Copy Scribe
            </Button>
            <Button onClick={handleClearHistory} size={"sm"}>
              Clear
            </Button>
          </Box>
          <DrawerBody p="0px">
            <ChatGPTInputTextArea
              input={input}
              setValue={setValue}
              getValues={getValues}
              setInput={setInput}
              scribeId={scribe.id}
              messages={messages}
              setMessages={setMessages}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>{" "}
    </div>
  );
};

export default ChatDrawer;

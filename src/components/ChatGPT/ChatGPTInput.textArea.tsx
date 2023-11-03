import { Dispatch, SetStateAction } from "react";
import {
  Box,
  Flex,
  IconButton,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { AiOutlineSend } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { BiTrash } from "react-icons/bi";
import { trpcClient } from "@/utils/api";
import { UseFormSetValue, UseFormGetValues } from "react-hook-form";
import { ChatBlock, ChatGPTMessage, LoadingChatLine } from "./ChatBlock";

export function ChatGPTInputTextArea({
  input,
  setInput,
  scribeId,
  messages,
  setMessages,
  getValues,
  setValue,
}: {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  scribeId: number;
  messages: ChatGPTMessage[];
  setMessages: Dispatch<SetStateAction<ChatGPTMessage[]>>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
}) {
  const user = useSession().data?.user;
  const textBlockBg = useColorModeValue("brand.700", "gray.800");

  const { mutate: chat, isLoading } =
    trpcClient.chatGPT.chatInScribe.useMutation({
      onSuccess: (data) => {
        setMessages((prev) => [
          ...prev,
          { content: data.content, role: "assistant" },
        ]);
      },
    });

  const {} = trpcClient.chatGPT.getScribeChat.useQuery(
    { scribeId: scribeId },
    {
      enabled: !!scribeId,
      onSuccess: (data) => {
        if (messages.length === 1 && data.length > 0) {
          setMessages((prev) => [...prev, ...(data as ChatGPTMessage[])]);
        }
      },
    },
  );

  const handleSubmitChat = () => {
    setMessages((prev) => [...prev, { content: input, role: "user" }]);
    chat({ scribeId: scribeId, messages: messages, userContent: input });
    setInput("");
  };

  return (
    <Flex direction={"column"}>
      <Box marginBottom={"150px"}>
        {messages.map(({ content, role }, index) => (
          <ChatBlock
            setValue={setValue}
            getValues={getValues}
            key={index}
            role={role}
            content={content}
            imageUrl={user?.image}
          />
        ))}
        {isLoading && <LoadingChatLine />}
      </Box>

      <Box
        height={"150px"}
        width={"100%"}
        backgroundColor={textBlockBg}
        position={"fixed"}
        bottom={"0"}
        left={"0"}
        textAlign={"center"}
      >
        <Flex gap={"10px"} p="20px">
          <Textarea
            aria-label="chat input"
            required
            minHeight={"100px"}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            placeholder={"Type a message"}
            _placeholder={{ color: "gray.200" }}
            color={"white"}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmitChat();
              }
            }}
          />
          <Flex flexDir="column" gap={"20px"}>
            <IconButton
              aria-label="Send message"
              type="submit"
              isDisabled={isLoading}
              onClick={() => handleSubmitChat()}
            >
              <AiOutlineSend />
            </IconButton>
            <IconButton
              isDisabled={isLoading}
              aria-label="Clear message"
              onClick={() => setInput("")}
            >
              <BiTrash />
            </IconButton>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}

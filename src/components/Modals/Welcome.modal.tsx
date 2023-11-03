import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  Text,
  useDisclosure,
  Flex,
  Button,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { appOptions, siteData } from "@/lib/Constants";
import { trpcClient } from "@/utils/api";
import { handleUseMutationAlerts } from "../Alerts/MyToast";

const WelcomeModal = () => {
  const { onClose, isOpen, onOpen } = useDisclosure();
  const trpcContext = trpcClient.useUtils();
  const { data: preferences } = trpcClient.users.getMyPreferences.useQuery(
    undefined,
    { refetchOnWindowFocus: false },
  );

  const { mutate: setHasSeenOboardingTrue } =
    trpcClient.users.hasSeenOnboarding.useMutation(
      handleUseMutationAlerts({
        successText: "LET'S GO! 🚀",
        callback: () => {
          trpcContext.users.invalidate();
          onClose();
        },
      }),
    );

  useEffect(() => {
    if (!appOptions.enableWelcomeModal) return;
    if (preferences && !preferences?.hasSeenOnboarding && !isOpen) {
      onOpen();
    }
    if (preferences && preferences.hasSeenOnboarding && isOpen) {
      onClose();
    }

    return () => {};
  }, [preferences, isOpen]);

  return (
    <Modal
      blockScrollOnMount={false}
      onClose={onClose}
      size={"3xl"}
      isOpen={isOpen}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader marginTop={"-10px"} fontSize={"4xl"}>
          Welcome to {siteData.appName}!
        </ModalHeader>
        <ModalBody>
          <Flex p={{ base: "5px", md: "15px" }} flexDir={"column"} gap={"10px"}>
            <Text fontWeight={"bold"} fontSize={"2xl"}>
              First steps:
            </Text>
            <Text fontSize={"xl"}>
              <span className="font-bold">1.💡 </span>
              Add your first scribe by clicking on the shiny button after
              closing this dialog.
            </Text>
            <Text fontSize={"xl"}>
              <span className="font-bold">2. 🔈 </span>
              Drop or pick the audio file you want to transcribe.
            </Text>
            <Text fontSize={"xl"}>
              <span className="font-bold">3.🤖 </span>
              Press the transcription button.
            </Text>
            <Text fontSize={"xl"}>
              <span className="font-bold">4. ✏ </span>
              Edit the transcription content with the text editor, user the
              build in Chat GPT functions or the Chat sidebar.{" "}
            </Text>
            <Text fontSize={"xl"}>
              <span className="font-bold">5. 🖨️ </span>
              Export or print by clicking on the options inside the
              transcription section.{" "}
            </Text>
            <Button
              onClick={() => setHasSeenOboardingTrue()}
              alignSelf={"end"}
              w="fit-content"
              mt={"10px"}
            >
              Awesome, let's start!
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WelcomeModal;

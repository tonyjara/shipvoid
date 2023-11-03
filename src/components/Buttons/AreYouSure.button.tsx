import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

interface props {
  buttonText?: string;
  confirmAction: () => void;
  modalContent: string;
  title?: string;
  dontAskAgainAction?: () => void;
  customButton?: React.ReactNode;
  confirmButtonText?: string;
  isDisabled?: boolean;
  rightIcon?: any;
  leftIcon?: any;
  glow?: boolean;
}

const AreYouSureButton = ({
  buttonText,
  confirmAction,
  dontAskAgainAction,
  modalContent,
  title,
  customButton,
  confirmButtonText,
  isDisabled,
  leftIcon,
  glow,
  rightIcon,
}: props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleConfirmAction = () => {
    confirmAction();
    onClose();
  };

  return (
    <>
      {!customButton ? (
        <Button
          className={glow ? "glow" : ""}
          rightIcon={rightIcon}
          leftIcon={leftIcon}
          isDisabled={isDisabled}
          onClick={onOpen}
          size={"sm"}
          w="max-content"
        >
          {buttonText}
        </Button>
      ) : (
        <div onClick={onOpen}>{customButton}</div>
      )}
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={"2xl"} marginTop={"-10px"}>
            {title ?? "Are you sure?"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {modalContent}

            {dontAskAgainAction && <Checkbox>Don't ask me again</Checkbox>}
          </ModalBody>

          <ModalFooter display={"flex"} justifyContent={"space-between"}>
            <Button size={"sm"} variant={"outline"} onClick={onClose}>
              Cancel
            </Button>
            <Button
              isDisabled={isDisabled}
              onClick={handleConfirmAction}
              mr={3}
              size={"sm"}
              w="max-content"
            >
              {confirmButtonText ?? "Confirm"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AreYouSureButton;

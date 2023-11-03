import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
} from "@chakra-ui/react";
import React from "react";
import CreateScribeForm from "../Forms/CreateScribe.form";

const CreateScribeModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal
      blockScrollOnMount={false}
      onClose={onClose}
      size={"3xl"}
      isOpen={isOpen}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader marginTop={"-10px"} fontSize={"2xl"}>
          New Scribe
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CreateScribeForm />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateScribeModal;

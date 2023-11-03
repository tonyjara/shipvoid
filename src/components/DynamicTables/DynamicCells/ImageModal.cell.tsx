import React from "react";
import {
  Flex,
  useDisclosure,
  Modal,
  Icon,
  Image,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { MdOutlineImageNotSupported, MdOutlineImage } from "react-icons/md";

const ImageModalCell = ({
  url,
  imageName,
}: {
  url?: string;
  imageName?: string;
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <>
      <Flex
        cursor={url && "pointer"}
        onClick={(e) => {
          e.stopPropagation();
          url && onOpen();
        }}
      >
        <Icon fontSize={"2xl"}>
          {url && url?.length > 0 ? (
            <MdOutlineImage />
          ) : (
            <MdOutlineImageNotSupported />
          )}
        </Icon>
      </Flex>

      <Modal size="xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{imageName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {" "}
            <TransformWrapper>
              <TransformComponent>
                <Image alt="expandable image" src={url} />
              </TransformComponent>
            </TransformWrapper>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ImageModalCell;

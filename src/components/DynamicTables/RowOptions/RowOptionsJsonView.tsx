import {
    useDisclosure,
    MenuItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/react"
import React from "react"
import JsonView from "react18-json-view"
import "react18-json-view/src/style.css"
import "react18-json-view/src/dark.css"

interface props {
    x: any
}

export function RowOptionsJsonView({ x }: props) {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <div>
            <MenuItem onClick={onOpen}>View JSON Object</MenuItem>

            <Modal size={"4xl"} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{x?.id ?? ""}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody background={"gray.50"} minW={"xl"}>
                        <JsonView src={x} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    )
}

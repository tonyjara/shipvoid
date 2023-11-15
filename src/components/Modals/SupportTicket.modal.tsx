import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Button,
  Text,
  Stack,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormControlledText from "../Forms/FormControlled/FormControlledText";
import { useSession } from "next-auth/react";
import FormControlledFeedbackUpload from "../Forms/FormControlled/FormControlledFeedbackUpload";
import { trpcClient } from "@/utils/api";
import { handleMutationAlerts } from "../Alerts/MyToast";
import {
  FormSupportTicket,
  defaultSupportTicketValues,
  validateSupportTicket,
} from "@/lib/Validations/SupportTicket.validate";

const SupportTicketModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const user = useSession().data?.user;
  const trpcContext = trpcClient.useUtils();
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormSupportTicket>({
    defaultValues: defaultSupportTicketValues,
    resolver: zodResolver(validateSupportTicket),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const { mutate: submitTicket } =
    trpcClient.support.submitFeedback.useMutation(
      handleMutationAlerts({
        successText:
          "Your feedback has been submited, you will be contacted shortly.",
        callback: () => {
          trpcContext.invalidate();
          handleClose();
        },
      }),
    );

  const submitFunc = async (data: FormSupportTicket) => {
    submitTicket(data);
  };
  return (
    <Modal
      blockScrollOnMount={false}
      onClose={handleClose}
      size={"md"}
      isOpen={isOpen}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mt={"-10px"} fontSize={"2xl"}>
          Feedback
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={"20px"}>
          <form onSubmit={handleSubmit(submitFunc)} noValidate>
            <Flex
              gap={"20px"}
              flexDir={"column"}
              align={"start"}
              justify={"center"}
            >
              <Text fontSize={{ base: "2xl", sm: "2xl" }}>
                We want to hear from you!
              </Text>

              <Text>
                If you have any feedback, questions, or want to report a bug,
                please fill out the form below.
              </Text>
              <Stack
                spacing={8}
                w={"full"}
                maxW={"md"}
                bg={useColorModeValue("white", "gray.700")}
                alignItems={"center"}
              >
                <FormControlledText
                  isRequired
                  control={control}
                  name="subject"
                  label="Subject"
                  errors={errors}
                  maxLength={150}
                  helperText="What is your feedback about?"
                />

                <FormControlledText
                  isRequired
                  control={control}
                  name="message"
                  label="Message"
                  errors={errors}
                  maxLength={1500}
                  helperText="Please describe your feedback in detail."
                  isTextArea
                />
                {user && (
                  <FormControlledFeedbackUpload
                    control={control}
                    errors={errors}
                    urlName="imageUrl"
                    imageName="imageName"
                    setValue={setValue}
                    userId={user?.id}
                    helperText="Not required, but if you want to include a screenshot, you can upload it here."
                  />
                )}
                <Button
                  isDisabled={isSubmitting}
                  onClick={handleSubmit(submitFunc)}
                  w="full"
                >
                  Submit{" "}
                </Button>
              </Stack>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SupportTicketModal;

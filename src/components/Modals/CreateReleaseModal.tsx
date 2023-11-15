import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Button,
} from "@chakra-ui/react";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormControlledText from "../Forms/FormControlled/FormControlledText";
import { trpcClient } from "@/utils/api";
import { handleMutationAlerts } from "../Alerts/MyToast";
import {
  defaultReleaseValues,
  validateRelease,
} from "@/lib/Validations/Release.validate";
import { DownloadableProduct, PlatformProduct } from "@prisma/client";
import FormControlledRichTextBlock from "../Forms/FormControlled/FormControlledRichTextBlock";
import FormControlledZipUpload from "../Forms/FormControlled/FormControlledZipUpload";

const CreateReleaseModal = ({
  isOpen,
  onClose,
  platformProductName,
}: {
  isOpen: boolean;
  onClose: () => void;
  platformProductName: PlatformProduct;
}) => {
  const trpcContext = trpcClient.useUtils();
  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DownloadableProduct>({
    defaultValues: defaultReleaseValues,
    resolver: zodResolver(validateRelease),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const { mutate: createRelease } =
    trpcClient.releases.createRelease.useMutation(
      handleMutationAlerts({
        successText: "New release has been created",
        callback: () => {
          trpcContext.invalidate();
          handleClose();
        },
      }),
    );

  const submitFunc = async (data: DownloadableProduct) => {
    createRelease(data);
  };
  return (
    <Modal
      size={"4xl"}
      blockScrollOnMount={false}
      onClose={handleClose}
      isOpen={isOpen}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mt={"-10px"} fontSize={"2xl"}>
          New Release
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form
            className="flex w-full flex-col gap-4 pb-4"
            onSubmit={handleSubmit(submitFunc)}
            noValidate
          >
            <FormControlledText
              isRequired
              control={control}
              name="title"
              label="Title"
              errors={errors}
            />

            <FormControlledRichTextBlock
              control={control}
              name="content"
              label="Content"
              errors={errors}
            />
            <FormControlledZipUpload
              control={control}
              errors={errors}
              label="Upload a zip file"
              setValue={setValue}
              platformProductName={platformProductName}
            />
            <Button
              isDisabled={isSubmitting}
              onClick={handleSubmit(submitFunc)}
              w="full"
            >
              Submit{" "}
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateReleaseModal;

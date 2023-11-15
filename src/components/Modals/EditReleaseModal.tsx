import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Button,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormControlledText from "../Forms/FormControlled/FormControlledText";
import { trpcClient } from "@/utils/api";
import { handleMutationAlerts } from "../Alerts/MyToast";
import {
  defaultReleaseValues,
  validateRelease,
} from "@/lib/Validations/Release.validate";
import { DownloadableProduct } from "@prisma/client";
import FormControlledRichTextBlock from "../Forms/FormControlled/FormControlledRichTextBlock";
import FormControlledZipUpload from "../Forms/FormControlled/FormControlledZipUpload";

const EditReleaseModal = ({
  release,
  setEditRelease,
}: {
  release: DownloadableProduct | null;
  setEditRelease: React.Dispatch<
    React.SetStateAction<DownloadableProduct | null>
  >;
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

  useEffect(() => {
    if (!release) return;
    reset(release);
  }, [release]);

  const handleClose = () => {
    reset();
    setEditRelease(null);
  };

  const { mutate: createRelease } = trpcClient.releases.editRelease.useMutation(
    handleMutationAlerts({
      successText: "Release has been edited",
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
      isOpen={!!release}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader mt={"-10px"} fontSize={"2xl"}>
          Edit Release
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
            {release && (
              <FormControlledZipUpload
                control={control}
                errors={errors}
                label="Upload a zip file"
                setValue={setValue}
                platformProductName={release?.platformProductName}
              />
            )}
            <Button
              isDisabled={isSubmitting}
              onClick={handleSubmit(submitFunc)}
              w="full"
            >
              Edit{" "}
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditReleaseModal;

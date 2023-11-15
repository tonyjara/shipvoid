import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Role, User } from "@prisma/client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { handleMutationAlerts } from "../Alerts/MyToast";
import { trpcClient } from "@/utils/api";
import FormControlledSelect from "../Forms/FormControlled/FormControlledSelect";
import {
  UserEditValues,
  defaultEditUserValues,
  validateUserEdit,
} from "@/lib/Validations/User.validate";

const EditUserModal = ({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}) => {
  const context = trpcClient.useUtils();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UserEditValues>({
    defaultValues: defaultEditUserValues,
    resolver: zodResolver(validateUserEdit),
  });

  useEffect(() => {
    if (isOpen) {
      reset(user);
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleOnClose = () => {
    reset();
    onClose();
  };
  const { mutate, isLoading } = trpcClient.users.edit.useMutation(
    handleMutationAlerts({
      successText: "The account role was edited successfully",
      callback: () => {
        context.accounts.invalidate();
        handleOnClose();
      },
    }),
  );

  const submitFunc = async (data: UserEditValues) => {
    mutate(data);
  };

  const roleOptions: { value: Role; label: string }[] = [
    { value: "user", label: "User" },
    { value: "support", label: "Support" },
    { value: "admin", label: "Admin" },
  ];

  return (
    <Modal size="xl" isOpen={isOpen} onClose={handleOnClose}>
      <form onSubmit={handleSubmit(submitFunc)} noValidate>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit account role</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <FormControlledSelect
              control={control}
              errors={errors}
              name="role"
              label="Select a role"
              options={roleOptions ?? []}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={isLoading || isSubmitting}
              type="submit"
              colorScheme="blue"
              mr={3}
            >
              Edit
            </Button>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
};

export default EditUserModal;

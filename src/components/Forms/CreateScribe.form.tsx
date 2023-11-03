import FormControlledText from "@/components/Forms/FormControlled/FormControlledText";
import { handleUseMutationAlerts } from "@/components/Alerts/MyToast";
import { trpcClient } from "@/utils/api";
import { Button, Flex, Text } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const validateCreateScribe = z.object({
  scribeName: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name must be less than 100 characters"),
  scribeDescription: z
    .string()
    .min(3, "The description must be at least 3 characters long")
    .max(1000, "The description must be less than 1000 characters"),
});
interface newScribeForm {
  scribeName: string;
  scribeDescription: string;
}

const CreateScribeForm = () => {
  const trpcContext = trpcClient.useUtils();
  const router = useRouter();
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<newScribeForm>({
    defaultValues: { scribeName: "" },
    resolver: zodResolver(validateCreateScribe),
  });
  const { mutate, isLoading } = trpcClient.scribe.create.useMutation(
    handleUseMutationAlerts({
      successText: "Scribe created",
      callback: (scribe) => {
        trpcContext.scribe.invalidate();
        router.push(`home/scribes/${scribe.id}`);
      },
    }),
  );

  const submitFunc = async (data: newScribeForm) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(submitFunc)} noValidate>
      <Flex flexDir={"column"} gap={5}>
        <Text color={"gray.500"}>
          Pick a memorable name for your scribe, like "Meeting where I shined
          like a diamond"{" "}
        </Text>
        <FormControlledText
          control={control}
          errors={errors}
          name="scribeName"
          label="Scribe Name"
        />
        <FormControlledText
          control={control}
          errors={errors}
          name="scribeDescription"
          label="Scribe Description"
          isTextArea
          helperText="Give some context to your scribe, you can use this to search for it later"
        />
        <Button
          type="submit"
          isLoading={isSubmitting}
          isDisabled={isLoading || isSubmitting}
          colorScheme="green"
          size="sm"
          alignSelf={"flex-end"}
        >
          Next
        </Button>
      </Flex>
    </form>
  );
};

export default CreateScribeForm;

// http://localhost:3000/home/shows/edit/cll1ic1ln00009kqs94wcylx4

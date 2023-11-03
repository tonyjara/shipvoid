import { Box, Flex, VStack, Text } from "@chakra-ui/react";
import React from "react";
import { trpcClient } from "@/utils/api";
import { useForm } from "react-hook-form";
import AudioFileSelector from "./AudioFileSelector";
import { useLazyEffect } from "@/lib/hooks/useLazyEffect";
import StickyScribeActionsBar from "./StickyScribeActionsBar";
import ScribeDetails from "./ScribeDetails";
import { ScribePageType } from "./Scribes.types";
import TranscriptionEdit from "./TranscriptionEdit";
import { handleUseMutationAlerts } from "@/components/Alerts/MyToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Scribe } from "@prisma/client";
import ChatDrawer from "@/components/ChatDrawer";
import { validateScribeEdit } from "@/lib/Validations/ScribeEdit.validate";
import useUnsavedChangesWarning from "@/lib/hooks/useUnsavedChangesWarning";
export interface ScribePageProps {
  scribe: ScribePageType;
  nextScribe: {
    id: number;
  } | null;
  prevScribe: {
    id: number;
  } | null;
}

const ScribePage = ({ scribe, nextScribe, prevScribe }: ScribePageProps) => {
  const [collapseAll, setCollapseAll] = React.useState(false);

  const trpcContext = trpcClient.useUtils();
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,

    formState: { errors, isSubmitting, isDirty },
  } = useForm<ScribePageType>({
    defaultValues: scribe,
    resolver: zodResolver(validateScribeEdit),
  });

  const { mutate, isLoading } = trpcClient.scribe.edit.useMutation(
    handleUseMutationAlerts({
      successText: "Changes saved",
      callback: () => {
        trpcContext.invalidate();
      },
    }),
  );

  const { data: fetchedScribe, isFetchedAfterMount } =
    trpcClient.scribe.getUnique.useQuery(
      { id: scribe.id },
      {
        queryKey: ["scribe.getUnique", { id: scribe.id }],
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        initialData: scribe,
      },
    );

  useLazyEffect(() => {
    //Guarantees that the default data is from the getServerside props comp
    if (!isFetchedAfterMount || !fetchedScribe) return;
    reset(fetchedScribe);

    return () => {};
  }, [fetchedScribe, isFetchedAfterMount]);

  const submitFunc = (data: Scribe) => {
    mutate(data);
  };

  const someError = Object.keys(errors).length > 0;

  //Ask for confirmation before leaving the page
  useUnsavedChangesWarning(isDirty);

  return (
    <Box
      p={{ base: 3, md: 10 }}
      w="full"
      display={"flex"}
      flexDir={"row"}
      justifyContent={"center"}
      mb={"80px"}
    >
      <Flex maxW={"1000px"} w="full" flexDir={"column"} gap={13}>
        <form
          onKeyDown={(e) => {
            e.key === "Enter" && e.preventDefault();
          }}
          onSubmit={handleSubmit(submitFunc)}
          noValidate
        >
          {/* INFO: Sticky actions bar  */}

          <StickyScribeActionsBar
            isDirty={isDirty}
            fetchedScribe={scribe}
            prevScribe={prevScribe}
            nextScribe={nextScribe}
            reset={reset}
            isAnyButtonDisabled={isSubmitting || isLoading}
            submitFunc={() => handleSubmit(submitFunc)()}
            setCollapseAll={setCollapseAll}
          />

          <VStack mt={"20px"} spacing={8} alignItems={"flex-start"}>
            {someError && (
              <Text py={"10px"} color="red.300">
                There's some issues in the form, please resolve them before
                submitting.
              </Text>
            )}

            {/* INFO: Scribe details */}

            <ScribeDetails
              control={control}
              errors={errors}
              collapseAll={collapseAll}
              setCollapseAll={setCollapseAll}
            />

            {/* INFO: Audio selector */}

            <AudioFileSelector
              scribeId={scribe.id}
              collapseAll={collapseAll}
              setCollapseAll={setCollapseAll}
            />

            {/* INFO: Transcription */}

            <TranscriptionEdit
              collapseAll={collapseAll}
              setCollapseAll={setCollapseAll}
              scribe={fetchedScribe}
              setValue={setValue}
              control={control}
              errors={errors}
            />
          </VStack>
        </form>
      </Flex>
      <ChatDrawer setValue={setValue} getValues={getValues} scribe={scribe} />
    </Box>
  );
};
export default ScribePage;

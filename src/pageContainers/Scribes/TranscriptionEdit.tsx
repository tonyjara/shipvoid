import AreYouSureButton from "@/components/Buttons/AreYouSure.button";
import CollapsableContainer from "@/components/CollapsableContainer";
import FormControlledRichTextBlock from "@/components/Forms/FormControlled/FormControlledRichTextBlock";
import { handleUseMutationAlerts, myToast } from "@/components/Alerts/MyToast";
import { trpcClient } from "@/utils/api";
import React from "react";
import {
  Control,
  FieldErrors,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { ScribePageType } from "./Scribes.types";
import {
  Button,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import TranscriptionOptionsMenu from "./TranscriptionOptionsMenu";
import HtmlParser from "@/components/HtmlParser";

const TranscriptionEdit = ({
  control,
  errors,
  scribe,
  collapseAll,
  setCollapseAll,
  setValue,
}: {
  control: Control<ScribePageType>;
  errors: FieldErrors<ScribePageType>;
  scribe: ScribePageType | null | undefined;
  collapseAll: boolean;
  setCollapseAll: React.Dispatch<React.SetStateAction<boolean>>;
  setValue: UseFormSetValue<ScribePageType>;
}) => {
  const context = trpcClient.useContext();
  const currentScribe = useWatch({ control, name: "userContent" });
  const { mutate: transcribe } =
    trpcClient.transcriptions.transcribeAudioFromScribe.useMutation(
      handleUseMutationAlerts({
        successText: "Transcription generated successfully",
        callback: () => {
          context.invalidate();
        },
      }),
    );

  //Get audiofiles independently to avoid invalidating the whole scribe query
  const { data: audioFiles } =
    trpcClient.audioFiles.getScribeAudioFiles.useQuery({
      scribeId: scribe?.id,
    });
  const hasAudioFiles = !!audioFiles && audioFiles.length > 0;
  const transcription = useWatch({ control, name: "transcription" });

  const handleTranscriptionGenerate = () => {
    if (!scribe || !hasAudioFiles) {
      return myToast.error("No audio file selected");
    }
    transcribe({
      scribeId: scribe.id,
    });
  };

  return (
    <CollapsableContainer
      title="Transcription"
      collapseAll={collapseAll}
      setCollapseAll={setCollapseAll}
      subTitle={
        hasAudioFiles
          ? undefined
          : "Upload an audio file to generate a transcription"
      }
      titleComponents={
        <Flex gap={"10px"}>
          {transcription.length ? (
            <AreYouSureButton
              isDisabled={!scribe || !hasAudioFiles}
              buttonText="Generate"
              confirmAction={handleTranscriptionGenerate}
              title="Generate Transcription"
              modalContent="Are you sure you want to generate a transcription? This will overwrite any existing transcription."
            />
          ) : (
            <Button
              onClick={handleTranscriptionGenerate}
              isDisabled={!scribe || !hasAudioFiles}
              className="glow"
              size="sm"
            >
              Generate
            </Button>
          )}
          <TranscriptionOptionsMenu
            control={control}
            scribe={scribe}
            setValue={setValue}
          />
        </Flex>
      }
    >
      <Tabs pt={"10px"} variant="enclosed">
        <TabList>
          <Tab>Scribe</Tab>
          <Tab>Original</Tab>
          <Tab>Print Preview</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <FormControlledRichTextBlock
              control={control}
              errors={errors}
              name="userContent" //scribe
              helperText="You can always restore or copy the original transcription from the options menu. Don't forget to save your changes."
            />
          </TabPanel>
          <TabPanel>
            <FormControlledRichTextBlock
              control={control}
              errors={errors}
              name="transcription" //original
            />
          </TabPanel>
          <TabPanel>
            <HtmlParser content={currentScribe} />
          </TabPanel>
        </TabPanels>
      </Tabs>{" "}
    </CollapsableContainer>
  );
};

export default TranscriptionEdit;

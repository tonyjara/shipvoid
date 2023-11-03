import AreYouSureButton from "@/components/Buttons/AreYouSure.button";
import CollapsableContainer from "@/components/CollapsableContainer";
import FormControlledRichTextBlock from "@/components/Forms/FormControlled/FormControlledRichTextBlock";
import HtmlParser from "@/components/HtmlParser";
import { handleUseMutationAlerts, myToast } from "@/components/Alerts/MyToast";
import { trpcClient } from "@/utils/api";
import { Button, Flex, IconButton } from "@chakra-ui/react";
import { Scribe } from "@prisma/client";
import React, { useState } from "react";
import { Control, useWatch } from "react-hook-form";
import { SiOpenai } from "react-icons/si";

const UserContentEdit = ({
  control,
  errors,
  scribe,
  collapseAll,
  setCollapseAll,
}: {
  control: Control<any>;
  errors: any;
  scribe: Scribe | null | undefined;
  collapseAll: boolean;
  setCollapseAll: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const context = trpcClient.useContext();
  const [isEdit, setIsEdit] = useState(true);

  const transcription = useWatch({ control, name: "transcription" });
  const showNotes = useWatch({ control, name: "showNotes" });

  /* const { mutate: generateShowNotes, isLoading } = */
  /*   trpcClient.chatGPT.generateShowNotesFromTranscription.useMutation( */
  /*     handleUseMutationAlerts({ */
  /*       successText: "Show notes generated", */
  /*       callback: () => { */
  /*         context.invalidate(); */
  /*       }, */
  /*     }), */
  /*   ); */

  return (
    <>
      <CollapsableContainer
        title="Show Notes"
        collapseAll={collapseAll}
        setCollapseAll={setCollapseAll}
        titleComponents={
          <Flex w="100%" alignItems={"center"} justifyContent={"space-between"}>
            <Flex>
              <Button
                borderRightRadius={"none"}
                px={"10px"}
                size={"sm"}
                variant={isEdit ? "solid" : "outline"}
                onClick={() => setIsEdit(true)}
              >
                Edit
              </Button>
              <Button
                borderLeftRadius={"none"}
                px={"10px"}
                size={"sm"}
                variant={!isEdit ? "solid" : "outline"}
                onClick={() => setIsEdit(false)}
              >
                Preview
              </Button>
            </Flex>
            <AreYouSureButton
              customButton={
                <>
                  <IconButton
                    aria-label="Generate"
                    icon={<SiOpenai fontSize={"sm"} />}
                    /* isDisabled={isLoading || !transcription.length} */
                    hideFrom={"md"}
                  />

                  <Button
                    /* isDisabled={isLoading || !transcription.length} */
                    hideBelow={"md"}
                    rightIcon={<SiOpenai fontSize={"sm"} />}
                    size={"sm"}
                    w="max-content"
                  >
                    Generate
                  </Button>
                </>
              }
              /* isDisabled={isLoading || !transcription.length} */
              /* buttonText="Generate" */
              confirmAction={() => {
                if (!scribe || !scribe.transcription.length) {
                  return myToast.error("Transcription is empty");
                }
                /* generateShowNotes({ */
                /*   scribeId: scribe.id, */
                /*   transcription: scribe.transcription, */
                /* }); */
              }}
              title="Generate Show Notes"
              modalContent="Are you sure you want to generate show notes? This will overwrite any existing show notes, unsaved changes will be lost."
            />
          </Flex>
        }
      >
        {!isEdit && <HtmlParser content={showNotes} />}
        {isEdit && (
          <FormControlledRichTextBlock
            control={control}
            errors={errors}
            name="showNotes"
            label={
              transcription.length
                ? undefined
                : "To generate show notes, first generate a transcription"
            }
          />
        )}
      </CollapsableContainer>
    </>
  );
};

export default UserContentEdit;

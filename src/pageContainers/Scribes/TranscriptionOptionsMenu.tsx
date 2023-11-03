import {
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  useMediaQuery,
} from "@chakra-ui/react";
import React from "react";
import { handleUseMutationAlerts } from "@/components/Alerts/MyToast";
import { trpcClient } from "@/utils/api";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { BsThreeDots } from "react-icons/bs";
import { ScribePageType } from "./Scribes.types";
import AreYouSureButton from "@/components/Buttons/AreYouSure.button";
import { Control, UseFormSetValue, useWatch } from "react-hook-form";
import usePrintComponent from "@/lib/hooks/usePrintComponent";
import HtmlParser from "@/components/HtmlParser";

const TranscriptionOptionsMenu = ({
  scribe,
  setValue,
  control,
}: {
  scribe: ScribePageType | null | undefined;
  setValue: UseFormSetValue<ScribePageType>;
  control: Control<ScribePageType>;
}) => {
  const [isLargerThan800] = useMediaQuery("(min-width: 800px)");
  const currentScribe = useWatch({ control, name: "userContent" });

  const { mutate: summarizeUserContent } =
    trpcClient.chatGPT.summarizeUserContent.useMutation(
      handleUseMutationAlerts({
        successText: "Summary generated",
        callback: ({ summary }) => {
          setValue("userContent", summary);
        },
      }),
    );

  const { mutate: prettify } =
    trpcClient.chatGPT.prettifyUserContent.useMutation(
      handleUseMutationAlerts({
        successText: "It's pretty now",
        callback: ({ prettyContent }) => {
          setValue("userContent", prettyContent);
        },
      }),
    );

  const restore = () => {
    if (!scribe) return;
    setValue("userContent", scribe.transcription);
  };

  const { printRef, handlePrint, isPrinting } = usePrintComponent({});
  return (
    <>
      <Menu>
        {isLargerThan800 && (
          <MenuButton as={Button} size={"sm"} rightIcon={<ChevronDownIcon />}>
            Options
          </MenuButton>
        )}
        {!isLargerThan800 && (
          <MenuButton
            as={IconButton}
            size={"sm"}
            aria-label="Scribe options"
            icon={<BsThreeDots fontSize={"sm"} />}
          />
        )}
        <MenuList>
          <MenuGroup>
            <MenuItem>
              <AreYouSureButton
                customButton={<>Summarize</>}
                confirmAction={() =>
                  scribe && summarizeUserContent({ scribeId: scribe.id })
                }
                modalContent="This is going to overwrite your current scribe, but it's not going to save it, so you can discard the new changes if you want."
              />
            </MenuItem>
            <MenuItem>
              <AreYouSureButton
                customButton={<>Make it prettier</>}
                confirmAction={() =>
                  scribe && prettify({ scribeId: scribe.id })
                }
                modalContent="This is going to overwrite your current scribe, but it's not going to save it, so you can discard the new changes if you want."
              />
            </MenuItem>
            <MenuItem>
              <AreYouSureButton
                customButton={<>Restore original transcription</>}
                confirmAction={() => restore()}
                modalContent="This is going to overwrite your current scribe, but it's not going to save it, so you can discard the new changes if you want."
              />
            </MenuItem>
            <MenuItem onClick={handlePrint}>Print (pdf)</MenuItem>
            <MenuItem
              as="a"
              download={`${scribe?.name}.html`}
              href={`data:text/html;charset=utf-8,${encodeURIComponent(
                scribe?.userContent || "",
              )}`}
            >
              Download as html
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>

      {isPrinting && scribe?.userContent && (
        <div
          className="flex w-full flex-row justify-center px-10 pt-10"
          ref={printRef}
        >
          <div className="flex w-full max-w-4xl flex-col ">
            <HtmlParser mode="light" content={currentScribe} />
          </div>
        </div>
      )}
    </>
  );
};

export default TranscriptionOptionsMenu;

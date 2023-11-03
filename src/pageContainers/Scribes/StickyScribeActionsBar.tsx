import { Button, Flex, IconButton, useMediaQuery } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { TbPlayerSkipBack, TbPlayerSkipForward } from "react-icons/tb";
import { DeleteIcon } from "@chakra-ui/icons";
import { AiTwotoneSave } from "react-icons/ai";
import { UseFormReset } from "react-hook-form";
import ScribeOptionsMenu from "./ScribeOptionsMenu";
import { ScribePageType } from "./Scribes.types";
import { BiCollapse } from "react-icons/bi";

interface props {
  fetchedScribe: ScribePageType | null;
  nextScribe: {
    id: number;
  } | null;
  prevScribe: {
    id: number;
  } | null;
  isAnyButtonDisabled: boolean;
  reset: UseFormReset<ScribePageType>;
  submitFunc: () => void;
  isDirty: boolean;
  setCollapseAll: (value: React.SetStateAction<boolean>) => void;
}

const StickyScribeActionsBar = ({
  fetchedScribe,
  prevScribe,
  nextScribe,
  isAnyButtonDisabled,
  reset,
  submitFunc,
  isDirty,
  setCollapseAll,
}: props) => {
  const router = useRouter();
  const [isLargerThan800] = useMediaQuery("(min-width: 800px)");

  return (
    <Flex
      borderRadius={"md"}
      position={"sticky"}
      zIndex={10}
      top={{ base: "80px", md: "80px" }}
      gap={"10px"}
      outlineColor={"gray.700"}
      alignSelf={"flex-start"}
      justifyContent={"space-between"}
      height={"auto"}
    >
      <Flex gap={"10px"}>
        <IconButton
          outline={"solid 3px"}
          hideBelow={"sm"}
          size={"sm"}
          isDisabled={!prevScribe}
          onClick={() => router.push(`/home/scribes/${prevScribe?.id}`)}
          aria-label="Next Scribe"
          icon={<TbPlayerSkipBack fontSize={"sm"} />}
        />
        <Button
          as={!isLargerThan800 ? IconButton : undefined}
          icon={<BiCollapse />}
          size={"sm"}
          leftIcon={<BiCollapse />}
          onClick={() => setCollapseAll(true)}
        >
          {isLargerThan800 && "Collapse all"}
        </Button>
      </Flex>
      <Flex gap={"10px"}>
        <Button
          as={!isLargerThan800 ? IconButton : undefined}
          outline={"solid 3px"}
          icon={<DeleteIcon fontSize={"sm"} />}
          size={"sm"}
          rightIcon={<DeleteIcon fontSize={"sm"} />}
          onClick={(e) => {
            e.preventDefault();
            if (!fetchedScribe) return;
            reset(fetchedScribe);
          }}
          isDisabled={isAnyButtonDisabled || !isDirty}
        >
          {isLargerThan800 && "Discard"}
        </Button>
        <Button
          as={!isLargerThan800 ? IconButton : undefined}
          outline={"solid 3px"}
          icon={<AiTwotoneSave fontSize={"sm"} />}
          size={"sm"}
          rightIcon={<AiTwotoneSave fontSize={"sm"} />}
          onClick={submitFunc}
          isDisabled={isAnyButtonDisabled}
        >
          Save
        </Button>
        {fetchedScribe && <ScribeOptionsMenu scribe={fetchedScribe} />}
        <IconButton
          outline={"solid 3px"}
          hideBelow={"sm"}
          size={"sm"}
          isDisabled={!nextScribe || isAnyButtonDisabled}
          onClick={() => router.push(`/home/scribes/${nextScribe?.id}`)}
          aria-label="Next Scribe"
          icon={<TbPlayerSkipForward fontSize={"sm"} />}
        />
      </Flex>
    </Flex>
  );
};

export default StickyScribeActionsBar;

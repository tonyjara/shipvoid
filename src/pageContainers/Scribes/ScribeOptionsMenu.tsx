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
import { ChevronDownIcon, CloseIcon } from "@chakra-ui/icons";
import { BsThreeDots } from "react-icons/bs";
import { ScribePageType } from "./Scribes.types";
import AreYouSureButton from "@/components/Buttons/AreYouSure.button";
import { useRouter } from "next/router";

const ScribeOptionsMenu = ({ scribe }: { scribe: ScribePageType }) => {
  const context = trpcClient.useContext();
  const router = useRouter();
  const [isLargerThan800] = useMediaQuery("(min-width: 800px)");

  const { mutate: deleteScribe } = trpcClient.scribe.delete.useMutation(
    handleUseMutationAlerts({
      successText: "Scribe deleted!",
      callback: () => {
        context.invalidate();
        router.push("/home");
      },
    }),
  );

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
              {/* Delete Scribe */}
              <AreYouSureButton
                customButton={<div>Delete Scribe</div>}
                confirmAction={() => deleteScribe({ id: scribe.id })}
                modalContent="Are you sure you want to delete this scribe? This action cannot be undone."
              />
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
    </>
  );
};

export default ScribeOptionsMenu;

import HtmlParser from "@/components/HtmlParser";
import CreateReleaseModal from "@/components/Modals/CreateReleaseModal";
import { trpcClient } from "@/utils/api";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Input,
  Tag,
  TagLabel,
  TagLeftIcon,
  useDisclosure,
} from "@chakra-ui/react";
import { DownloadableProduct, PlatformProduct } from "@prisma/client";
import React from "react";
import { downloadRelease } from "./release.utils";
import { handleMutationAlerts } from "@/components/Alerts/MyToast";
import { format } from "date-fns";
import { BiCalendar } from "react-icons/bi";
import EditReleaseModal from "@/components/Modals/EditReleaseModal";

const AdminReleasesPage = ({
  platformProductName,
}: {
  platformProductName: PlatformProduct;
}) => {
  const trpcContext = trpcClient.useUtils();
  const [editRelease, setEditRelease] =
    React.useState<DownloadableProduct | null>(null);
  const { onClose, isOpen, onOpen } = useDisclosure();

  const { data: releases, isLoading } =
    trpcClient.releases.getManyByTag.useQuery({ platformProductName });

  const { mutate: deleteRelease, isLoading: isDeleting } =
    trpcClient.releases.deleteRelease.useMutation(
      handleMutationAlerts({
        successText: "Release deleted",
        callback: () => {
          trpcContext.invalidate();
        },
      }),
    );

  return (
    <>
      <Flex justifyContent={"center"}>
        <Flex flexDir={"column"} maxW={"800px"} w="full">
          <Flex justifyContent={"space-between"}>
            <Button onClick={onOpen}>Create Release</Button>
            <Input maxW={"200px"} placeholder="Search" />
          </Flex>
          <Divider my={"20px"} />
          <Flex flexDir={"column"} gap="20px">
            {releases?.map((release, i) => {
              const getDownloadUrl = async () => {
                await downloadRelease({
                  platformProductName: release.platformProductName,
                  release,
                });
              };

              return (
                <Card variant={"outline"} key={release.id}>
                  <CardHeader fontWeight={"bold"} fontSize={"2xl"}>
                    <Flex justifyContent={"space-between"}>
                      {release.title}
                      <Flex gap={"10px"}>
                        <Tag
                          hidden={i !== 0}
                          size={"sm"}
                          variant="subtle"
                          colorScheme="orange"
                        >
                          <TagLabel>Latest</TagLabel>
                        </Tag>
                        <Tag size={"sm"} variant="subtle" colorScheme="cyan">
                          <TagLeftIcon as={BiCalendar} />
                          <TagLabel>
                            {format(release.createdAt, "MM/dd/yy")}
                          </TagLabel>
                        </Tag>
                      </Flex>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <HtmlParser content={release.content} />
                  </CardBody>
                  <Divider mt={"20px"} />
                  <Flex m={"20px"} gap="20px">
                    <Button
                      disabled={isLoading}
                      onClick={getDownloadUrl}
                      w="fit-content"
                    >
                      Download
                    </Button>
                    <Button
                      disabled={isLoading || isDeleting}
                      onClick={() => setEditRelease(release)}
                      w="fit-content"
                      variant={"outline"}
                      colorScheme="orange"
                    >
                      Edit
                    </Button>
                    <Button
                      disabled={isLoading || isDeleting}
                      onClick={() => deleteRelease({ releaseId: release.id })}
                      w="fit-content"
                      variant={"outline"}
                    >
                      Delete
                    </Button>
                  </Flex>
                </Card>
              );
            })}
          </Flex>
        </Flex>
      </Flex>
      <CreateReleaseModal
        platformProductName={platformProductName}
        isOpen={isOpen}
        onClose={onClose}
      />
      <EditReleaseModal release={editRelease} setEditRelease={setEditRelease} />
    </>
  );
};

export default AdminReleasesPage;

import { handleUseMutationAlerts } from "@/components/Alerts/MyToast";
import PageContainer from "@/components/Containers/PageContainer";
import { trpcClient } from "@/utils/api";
import { Button, Flex, Text } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import React from "react";

const AdminUtilsPage = () => {
  const trpcContext = trpcClient.useUtils();
  const user = useSession().data?.user;
  const { mutate } = trpcClient.admin.verifySMTPconnection.useMutation();
  const { mutate: deleteStripeSubscription } =
    trpcClient.admin.deleteStripeSubscription.useMutation(
      handleUseMutationAlerts({
        successText: "Subscription deleted",
        callback: () => {
          trpcContext.invalidate();
        },
      }),
    );

  const { mutate: NUKE } = trpcClient.users.nukeUser.useMutation(
    handleUseMutationAlerts({
      successText: "User and all related data was deleted, logging out...",
      callback: () => {
        setTimeout(() => {
          signOut();
        }, 2000);
      },
    }),
  );

  return (
    <PageContainer className="mt-5 flex flex-row justify-center">
      <Flex flexDir={"column"} w="full" maxW={"800px"} gap={"20px"}>
        <Flex alignItems={"center"} w="full" justifyContent={"space-between"}>
          <Text fontSize={"xl"}>
            - Verify if the conection to AWS SES is valid
          </Text>
          <Button size={"sm"} onClick={() => mutate()}>
            Verify SMTP server
          </Button>
        </Flex>
        <Flex alignItems={"center"} w="full" justifyContent={"space-between"}>
          <Text fontSize={"xl"}>- Delete stripe subscription ( Dev only )</Text>
          <Button size={"sm"} onClick={() => deleteStripeSubscription()}>
            Delete subscription
          </Button>
        </Flex>
        <Flex alignItems={"center"} w="full" justifyContent={"space-between"}>
          <Text fontSize={"xl"}>
            - Delete current user and related data ( Dev only )
          </Text>
          <Button size={"sm"} onClick={() => user && NUKE({ userId: user.id })}>
            NUKE USER
          </Button>
        </Flex>
      </Flex>
    </PageContainer>
  );
};

export default AdminUtilsPage;

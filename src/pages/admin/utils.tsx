import { handleMutationAlerts } from "@/components/Alerts/MyToast";
import PageContainer from "@/components/Containers/PageContainer";
import { trpcClient } from "@/utils/api";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import React from "react";

const AdminUtilsPage = () => {
  const [testEmail, setTestEmail] = React.useState<string>("");
  const trpcContext = trpcClient.useUtils();
  const user = useSession().data?.user;
  const { mutate } = trpcClient.admin.verifySMTPconnection.useMutation(
    handleMutationAlerts({ successText: "SMTP connection verified" }),
  );

  const { mutate: sendTestEmail } = trpcClient.admin.sendTestEmail.useMutation(
    handleMutationAlerts({ successText: "Test email sent" }),
  );
  const { mutate: NUKE } = trpcClient.users.nukeUser.useMutation(
    handleMutationAlerts({
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
          <Text fontSize={"xl"}>
            - Delete current user and related data ( Dev only )
          </Text>
          <Button size={"sm"} onClick={() => user && NUKE({ userId: user.id })}>
            NUKE USER
          </Button>
        </Flex>
        <Flex alignItems={"center"} w="full" justifyContent={"space-between"}>
          <Flex alignItems={"center"} gap={"10px"}>
            <Text fontSize={"xl"}>- Send test email</Text>
            <Input
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              maxW={"200px"}
              placeholder="email"
            />
          </Flex>
          <Button
            onClick={() => {
              sendTestEmail({ email: testEmail });
            }}
            size={"sm"}
          >
            SEND
          </Button>
        </Flex>
      </Flex>
    </PageContainer>
  );
};

export default AdminUtilsPage;

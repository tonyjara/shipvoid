import { handleUseMutationAlerts } from "@/components/Alerts/MyToast";
import PageContainer from "@/components/Containers/PageContainer";
import { decimalFormat } from "@/lib/utils/DecimalUtils";
import { prettyPriceTags } from "@/lib/utils/enumUtils";
import { trpcClient } from "@/utils/api";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  Skeleton,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { format } from "date-fns";
import React, { useState } from "react";

//Simulate stripe usage or credits usage
const UsagePlaygroundPage = () => {
  const trpcContext = trpcClient.useUtils();
  const [chatIO, setChatIO] = useState<{
    inputTokens: number;
    outputTokens: number;
  }>({ inputTokens: 0, outputTokens: 0 });

  const [chatCredits, setChatCredits] = useState<{
    inputTokens: number;
    outputTokens: number;
  }>({ inputTokens: 0, outputTokens: 0 });

  const [transcriptionMinutes, setTranscriptionMinutes] = useState(0);

  const { mutate: getSubscription } =
    trpcClient.stripeUsage.getMySubscription.useMutation(
      handleUseMutationAlerts({
        successText: "subscription fetched",
        callback: (data) => {
          console.info(data);
        },
      }),
    );
  const { data: myUsage, isLoading } =
    trpcClient.stripeUsage.getMyUsageForCurrentBillingCycle.useQuery();

  const { data: upcomingInvoice } =
    trpcClient.stripeUsage.getUpcomingInvoice.useQuery();

  const { mutate: postChatUsage } = trpcClient.admin.postChatUsage.useMutation(
    handleUseMutationAlerts({
      successText: "Usage posted",
      callback: () => {
        trpcContext.invalidate();
      },
    }),
  );

  const { mutate: postTranscriptionMinutes } =
    trpcClient.admin.postTranscriptionMinutesUsage.useMutation(
      handleUseMutationAlerts({
        successText: "Usage posted",
        callback: () => {
          trpcContext.invalidate();
        },
      }),
    );

  const { mutate: addChatCredits } =
    trpcClient.stripeUsage.addChatCredits.useMutation(
      handleUseMutationAlerts({
        successText: "Credits added",
        callback: () => {
          trpcContext.invalidate();
        },
      }),
    );
  const statBg = useColorModeValue("white", "gray.700");

  return (
    <PageContainer>
      <Flex
        flexDir={{ base: "column", lg: "row" }}
        justifyContent={"space-evenly"}
      >
        <Flex p={2} maxW={"600px"} gap={"20px"} w="full" flexDir={"column"}>
          <Flex justifyContent={"space-between"} alignItems={"end"}>
            <Flex flexDir={"column"}>
              <FormLabel>Chat input</FormLabel>
              <Input
                maxW={"130px"}
                onChange={(e) => {
                  setChatIO({
                    ...chatIO,
                    inputTokens: parseInt(e.target.value),
                  });
                }}
                value={chatIO.inputTokens}
                type="number"
              />
            </Flex>
            <Flex flexDir={"column"}>
              <FormLabel>Chat output</FormLabel>
              <Input
                maxW={"130px"}
                value={chatIO.outputTokens}
                onChange={(e) => {
                  setChatIO({
                    ...chatIO,
                    outputTokens: parseInt(e.target.value),
                  });
                }}
                type="number"
              />
            </Flex>
            <Button
              onClick={() =>
                postChatUsage({
                  inputTokens: chatIO.inputTokens,
                  outputTokens: chatIO.outputTokens,
                })
              }
            >
              Post chat usage
            </Button>
          </Flex>
          <Flex justifyContent={"space-between"} alignItems={"end"}>
            <Flex flexDir={"column"}>
              <FormLabel>Chat input</FormLabel>
              <Input
                maxW={"130px"}
                onChange={(e) => {
                  setChatCredits({
                    ...chatCredits,
                    inputTokens: parseInt(e.target.value),
                  });
                }}
                value={chatCredits.inputTokens}
                type="number"
              />
            </Flex>
            <Flex flexDir={"column"}>
              <FormLabel>Chat output</FormLabel>
              <Input
                maxW={"130px"}
                value={chatCredits.outputTokens}
                onChange={(e) => {
                  setChatCredits({
                    ...chatCredits,
                    outputTokens: parseInt(e.target.value),
                  });
                }}
                type="number"
              />
            </Flex>
            <Button
              onClick={() =>
                addChatCredits({
                  inputTokens: chatCredits.inputTokens,
                  outputTokens: chatCredits.outputTokens,
                })
              }
            >
              Add chat credits
            </Button>
          </Flex>

          <Flex justifyContent={"space-between"} alignItems={"end"}>
            <Flex flexDir={"column"}>
              <FormLabel>Transcription Minutes</FormLabel>
              <Input
                maxW={"130px"}
                onChange={(e) => {
                  setTranscriptionMinutes(parseInt(e.target.value));
                }}
                value={transcriptionMinutes}
                type="number"
              />
            </Flex>
            <Button
              onClick={() =>
                postTranscriptionMinutes({
                  durationInMinutes: transcriptionMinutes,
                })
              }
            >
              Post transcription minutes
            </Button>
          </Flex>
          <Button w="fit-content" onClick={() => getSubscription()}>
            Log stripe subscription
          </Button>
        </Flex>
        <Box w="full" maxW={"800px"}>
          <Heading mb={"20px"} maxW={"7xl"}>
            My usage{" "}
          </Heading>
          <Text fontSize={"2xl"} mb={"10px"}>
            End of billing cycle:{" "}
            {upcomingInvoice?.period_end
              ? format(upcomingInvoice.period_end, "dd/MM/yyyy")
              : "-"}
          </Text>
          <SimpleGrid columns={2} spacing={10}>
            {myUsage?.map((item: any) => {
              const value = item.data.reduce((acc: any, x: any) => {
                return (acc += x.total_usage);
              }, 0);

              return (
                item.tag !== "PLAN_FEE" &&
                item.tag !== "STORAGE_PER_GB" && (
                  <Skeleton key={item.tag} isLoaded={!isLoading}>
                    <Stat
                      px={{ base: 4, md: 8 }}
                      py={"5"}
                      shadow={"xl"}
                      bg={statBg}
                      rounded={"lg"}
                    >
                      <StatLabel>{prettyPriceTags(item.tag)}</StatLabel>
                      <StatNumber>
                        {" "}
                        Credits left: {decimalFormat(item.credits)}
                      </StatNumber>
                      <StatNumber> Credits billed: {value}</StatNumber>
                    </Stat>
                  </Skeleton>
                )
              );
            })}
          </SimpleGrid>
        </Box>
      </Flex>
    </PageContainer>
  );
};

export default UsagePlaygroundPage;

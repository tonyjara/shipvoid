import PageContainer from "@/components/Containers/PageContainer";
import ClaimCouponsForm from "@/components/Forms/ClaimCoupons.form";
import SettingsLayout from "@/components/Layouts/Settings.layout";
import { decimalFormat } from "@/lib/utils/DecimalUtils";
import { prettyPriceTags } from "@/lib/utils/enumUtils";
import { trpcClient } from "@/utils/api";
import {
  Box,
  Text,
  Flex,
  Heading,
  SimpleGrid,
  Skeleton,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";
import { format } from "date-fns";
import Decimal from "decimal.js";
import React from "react";

const UsagePage = () => {
  const {
    data: myUsage,
    isLoading,
    isFetching,
  } = trpcClient.stripeUsage.getMyUsageForCurrentBillingCycle.useQuery();
  const { data: subscription } = trpcClient.users.getMySubscription.useQuery();
  const { data: upcomingInvoice } =
    trpcClient.stripeUsage.getUpcomingInvoice.useQuery();

  const statBg = useColorModeValue("white", "gray.700");

  const loading = isLoading || isFetching || !myUsage?.length || !myUsage;

  const subscriptionName = () => {
    switch (subscription?.type) {
      case "FREE":
        return "Free";
      case "PAY_AS_YOU_GO":
        return "Freemium";
      default:
        return "Free";
    }
  };

  return (
    <SettingsLayout>
      <PageContainer>
        <Flex
          minH={"83vh"}
          w="100%"
          bg={useColorModeValue("gray.50", "gray.800")}
        >
          <Flex w="100%" flexDirection="column" alignItems="center">
            <Box w="full" maxW={"800px"}>
              <Heading mb={"10px"} maxW={"7xl"}>
                Current plan: {subscriptionName()}
              </Heading>
              {upcomingInvoice?.period_end && (
                <Text color={"gray.500"} fontSize={"lg"} mb={"10px"}>
                  End of billing cycle:{" "}
                  {format(upcomingInvoice.period_end, "MM/dd/yy")}
                </Text>
              )}
              <Text fontSize={"2xl"} mb={"10px"}>
                Billing cycle amount: $
                {upcomingInvoice?.amount_due &&
                  new Decimal(upcomingInvoice?.amount_due)
                    .dividedBy(100)
                    .toFixed(2)}
              </Text>
              <Text color={"gray.500"} fontSize={"lg"} mb={"10px"}>
                For a more detailed breakdown of your usage, please visit the{" "}
                Billing/Plan tab.
              </Text>
              <Text fontSize={"xl"} mb={"20px"}>
                Billing cycle breakdown:
              </Text>
              <SimpleGrid columns={2} spacing={10}>
                {loading && (
                  <>
                    <Skeleton height="150px" width="100%" borderRadius={"md"} />
                    <Skeleton height="150px" width="100%" borderRadius={"md"} />
                    <Skeleton height="150px" width="100%" borderRadius={"md"} />
                  </>
                )}
                {!loading &&
                  myUsage?.map((item) => {
                    const findUpcomingAmount = () => {
                      if (
                        upcomingInvoice &&
                        upcomingInvoice.lines.data.length > 0 &&
                        item.subscriptionItemId
                      ) {
                        const line = upcomingInvoice?.lines.data.find(
                          (x) =>
                            x.subscription_item === item.subscriptionItemId,
                        );
                        if (line) {
                          return `$${new Decimal(line.amount)
                            .dividedBy(100)
                            .toFixed(2)}`;
                        }
                        return 0;
                      }
                      return 0;
                    };

                    return (
                      item.tag !== "PLAN_FEE" &&
                      item.tag !== "STORAGE_PER_GB" && (
                        <Stat
                          key={item.tag}
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
                          <StatNumber>
                            {" "}
                            Billed: {findUpcomingAmount()}
                          </StatNumber>
                        </Stat>
                      )
                    );
                  })}
              </SimpleGrid>
            </Box>
            <ClaimCouponsForm />
          </Flex>
        </Flex>
      </PageContainer>
    </SettingsLayout>
  );
};

export default UsagePage;

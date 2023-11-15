import { Text, Box, chakra, Heading, Flex } from "@chakra-ui/react";
import { trpcClient } from "@/utils/api";
import { useSession } from "next-auth/react";
import { handleMutationAlerts } from "@/components/Alerts/MyToast";
import {
  transcribelyHeroContentPurchased,
  transcribelyHeroContentNotPurchased,
} from "@/lib/Constants/transcribely.constants";
import TranscribelyHeroOptions from "./Transcribely.heroOptions";
import TranscribelyPurchasedHeroButtons from "./TranscribelyPurchasedHeroButtons";

const TranscribelyHero = () => {
  const session = useSession();
  const { data: transcribelyIsPurchased } =
    trpcClient.users.getMyPurchasesByTag.useQuery(
      {
        platformProductName: "TRANSCRIBELY",
      },
      {
        enabled: session.status === "authenticated",
      },
    );

  const heroContent = transcribelyIsPurchased
    ? transcribelyHeroContentPurchased
    : transcribelyHeroContentNotPurchased;

  const { mutate, isLoading: isMutating } =
    trpcClient.stripe.getSessionUrlAndCreatePaymentIntent.useMutation(
      handleMutationAlerts({
        successText: "Redirecting to checkout...",
        callback: ({ url }) => {
          if (!url) return;
          window.location.assign(url);
        },
      }),
    );

  //Get the price and product by tag of the main product to sell in the hero page
  const { data, isLoading, isFetching } =
    trpcClient.stripe.getPriceAndProductByTag.useQuery(
      {
        platformProductName: "TRANSCRIBELY",
      },
      { refetchOnWindowFocus: false },
    );

  const handleCheckout = async () => {
    if (!data?.product || !data.price) return;
    const productId = data.product.id;
    const defaultPriceId = data.price.id;

    if (!productId || !defaultPriceId) return;
    mutate({ productId, defaultPriceId, platformProductName: "TRANSCRIBELY" });
  };

  return (
    <Flex
      pb={{ base: 20, md: 20 }}
      pt={{ base: 10, md: 0 }}
      alignItems={"center"}
      flexDir={{ base: "column", lg: "row" }}
      justifyContent={{ base: "normal", lg: "space-evenly" }}
      overflow={"hidden"}
      position={"relative"}
      minH={"90vh"}
    >
      <Flex
        px={{ base: "0px", md: "20px" }}
        overflow={"hidden"}
        flexDir={"column"}
        maxW={"7xl"}
        zIndex={1}
      >
        <Heading
          fontSize={{
            base: "5xl",
            sm: "5xl",
            md: "6xl",
            xl: "7xl",
          }}
          letterSpacing="tight"
          lineHeight="short"
          fontWeight="extrabold"
          color="gray.900"
          _dark={{
            color: "white",
          }}
          display={"flex"}
          justifyContent={{ base: "center", lg: "left" }}
          gap={"1rem"}
        >
          <chakra.span>{heroContent.title} </chakra.span>
          <chakra.span
            color="brand.500"
            _dark={{
              color: "brand.400",
            }}
          >
            {heroContent.highlight}{" "}
          </chakra.span>
        </Heading>
        <Text
          mt={{
            base: 8,
            sm: 5,
          }}
          fontSize={{
            sm: "lg",
            md: "xl",
          }}
          maxW={{
            sm: "xl",
          }}
          mx={{
            sm: "auto",
            lg: 0,
          }}
          fontWeight="medium"
          px={{ base: "20px", md: "0px" }}
        >
          {heroContent.description}
        </Text>
        {/* Manage depending on appOption */}
        {!transcribelyIsPurchased && (
          <TranscribelyHeroOptions
            handleCheckout={handleCheckout}
            checkoutDisabled={isLoading || isFetching || isMutating}
          />
        )}
        {transcribelyIsPurchased && <TranscribelyPurchasedHeroButtons />}
      </Flex>

      <Box
        maxW={"xl"}
        mt={{ base: "200px", sm: "200px", md: "220px", lg: "0px" }}
        mb={{ base: "80px", sm: "0px", md: "0px", lg: "0px" }}
        className="orbit-container"
      >
        <img className="inner-img" src="/assets/hero/blackhole.png" alt="" />
        <div style={{ "--total": 10 } as React.CSSProperties} className="orbit">
          <div className="planet" style={{ "--i": 1 } as React.CSSProperties}>
            <img className="planet-image" src="/assets/tech/ts.png" alt="" />
          </div>

          <div className="planet" style={{ "--i": 2 } as React.CSSProperties}>
            <img
              className="planet-image"
              src="/assets/tech/nextjs.png"
              alt=""
            />
          </div>

          <div className="planet" style={{ "--i": 3 } as React.CSSProperties}>
            <img
              className="planet-image"
              src="/assets/tech/chakra.png"
              alt=""
            />
          </div>
          <div className="planet" style={{ "--i": 4 } as React.CSSProperties}>
            <img className="planet-image" src="/assets/tech/trpc.png" alt="" />
          </div>
          <div className="planet" style={{ "--i": 5 } as React.CSSProperties}>
            <img
              className="planet-image"
              src="/assets/tech/stripe.png"
              alt=""
            />
          </div>
          <div className="planet" style={{ "--i": 6 } as React.CSSProperties}>
            <img
              className="planet-image"
              src="/assets/tech/openai.png"
              alt=""
            />
          </div>
          <div className="planet" style={{ "--i": 7 } as React.CSSProperties}>
            <img className="planet-image" src="/assets/tech/aws.png" alt="" />
          </div>
          <div className="planet" style={{ "--i": 8 } as React.CSSProperties}>
            <img className="planet-image" src="/assets/tech/azure.png" alt="" />
          </div>
          <div className="planet" style={{ "--i": 9 } as React.CSSProperties}>
            <img
              className="planet-image"
              src="/assets/tech/google.png"
              alt=""
            />
          </div>
          <div className="planet" style={{ "--i": 10 } as React.CSSProperties}>
            <img
              className="planet-image"
              src="/assets/tech/prisma.png"
              alt=""
            />
          </div>
        </div>
      </Box>
    </Flex>
  );
};
export default TranscribelyHero;

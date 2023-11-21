import { Heading, Text, VStack, Container, Flex } from "@chakra-ui/react";
import { trpcClient } from "@/utils/api";
import PricingCard from "@/components/Cards/Pricing.card";
import { useSession } from "next-auth/react";
import { handleMutationAlerts } from "@/components/Alerts/MyToast";
import { type PricingPageProps } from "@/pages";
import { pricingPageContent } from "@/lib/Constants/Pricing";
import Footer from "@/components/Hero/Footer";
import Faq from "@/components/Hero/Faq";
import { transcribelyFaq } from "@/lib/Constants/SiteData";

export default function PricingPage({ prices, products }: PricingPageProps) {
  const session = useSession();

  const authenticated = session?.status === "authenticated";

  const { mutate } =
    trpcClient.stripe.getSessionUrlAndCreatePaymentIntent.useMutation(
      handleMutationAlerts({
        successText: "Redirecting to checkout...",
        callback: ({ url }) => {
          if (!url) return;
          window.location.assign(url);
        },
      }),
    );
  /**/
  const handleCheckout = async (productId?: any, defaultPriceId?: any) => {
    if (!productId || !defaultPriceId) return;
    mutate({ productId, defaultPriceId, platformProductName: "TRANSCRIBELY" });
  };

  return (
    <>
      <Container id="pricing" py={12} maxW={"5xl"}>
        <VStack spacing={2} textAlign="center">
          <Heading maxW="800px" as="h1" fontSize="4xl">
            {pricingPageContent.title}
          </Heading>
          <Text maxW="800px" fontSize="lg" color={"gray.500"}>
            {pricingPageContent.description}
          </Text>
        </VStack>
        <Flex
          flexDir={{ base: "column", md: "row" }}
          gap={8}
          justifyContent="center"
          py={10}
        >
          {products.data
            .sort(
              (a: any, b: any) =>
                (a.metadata?.sortOrder ?? "0") - (b.metadata?.sortOrder ?? "0"),
            )
            .map((product, i) => {
              const productPrices = prices.data.filter(
                (x) => x.product === product.id,
              );
              const features = product.metadata?.features;
              return (
                <PricingCard
                  popular={i === 1}
                  key={product.id}
                  handleCheckout={() => {
                    if (!product.default_price || !product.id) return;
                    return handleCheckout(product.id, product.default_price);
                  }}
                  description={product.description ?? ""}
                  autenticated={authenticated}
                  defaultPriceId={product.default_price?.toString() ?? ""}
                  prices={productPrices}
                  title={product.name}
                  features={features ? features.split(",") : []}
                />
              );
            })}
        </Flex>
      </Container>
      <Faq faq={transcribelyFaq} />
      <Footer />
    </>
  );
}

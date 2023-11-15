import {
  Text,
  Flex,
  Heading,
  Icon,
  Image,
  useColorModeValue,
  Grid,
} from "@chakra-ui/react";
import React from "react";
import PageContainer from "../Containers/PageContainer";
import {
  featuresPageContent,
  transcribelyFeatures,
} from "@/lib/Constants/SiteData";

const Features = () => {
  const [selectedFeature, setSelectedFeature] = React.useState<number | null>(
    null,
  );
  const [lockSelected, setLockSelected] = React.useState(false);

  return (
    <PageContainer id="features" className="flex flex-col items-center">
      <Flex
        marginTop={{ base: "10px", md: "40px" }}
        flexDir={"column"}
        alignItems={"center"}
        w="full"
        maxW={"1200px"}
      >
        <Flex gap={"20px"} align={"center"} flexDir={"column"} pb={"20px"}>
          <Heading>{featuresPageContent.title}</Heading>
          <Text maxW={"650px"} color={"gray.500"}>
            {featuresPageContent.description}
          </Text>
        </Flex>
        <Flex
          w="full"
          flexDir={{ base: "column", lg: "row" }}
          justifyContent={{ base: "center", md: "space-between" }}
          justifyItems={"center"}
          py={{ base: "0px", md: "40px" }}
          gap={"20px"}
        >
          <Grid
            w="full"
            gridGap={2}
            gridTemplateColumns={"repeat(auto-fit, minmax(150px, 1fr))"}
          >
            {transcribelyFeatures.map((feature, index) => (
              <Flex
                key={feature.title}
                minW={"150px"}
                maxH={"150px"}
                gap={"10px"}
                align={"center"}
                justify={"center"}
                flexDir={"column"}
                borderRadius={"md"}
                onMouseEnter={() => !lockSelected && setSelectedFeature(index)}
                onMouseLeave={() => !lockSelected && setSelectedFeature(null)}
                onClick={() => {
                  setLockSelected(!lockSelected);
                  lockSelected
                    ? setSelectedFeature(null)
                    : setSelectedFeature(index);
                }}
                cursor={"pointer"}
              >
                <Flex
                  w={12}
                  h={12}
                  _hover={{
                    outline: "1px solid",
                    outlineColor: "brand.500",
                  }}
                  align={"center"}
                  justify={"center"}
                  color={"white"}
                  rounded={"full"}
                  bg={useColorModeValue("gray.400", "gray.700")}
                >
                  <Icon
                    color={selectedFeature === index ? "brand.500" : undefined}
                    as={feature.icon}
                    w={7}
                    h={7}
                  />
                </Flex>
                <Text
                  color={selectedFeature === index ? "brand.500" : "gray.500"}
                  size="sm"
                >
                  {feature.title}
                </Text>
              </Flex>
            ))}
          </Grid>
          <Flex
            w="full"
            alignItems={"space-evenly"}
            flexDir={"column"}
            gap={"20px"}
          >
            <Image
              borderRadius={"md"}
              outline={"1px solid white"}
              mt={"30px"}
              w={"640px"}
              h={"360px"}
              objectFit="scale-down"
              src={
                selectedFeature !== null &&
                transcribelyFeatures[selectedFeature]?.src
                  ? transcribelyFeatures[selectedFeature]?.src
                  : "/assets/features/preview.jpeg"
              }
              alt="Feature Image"
            />
            <Text
              color={"gray.500"}
              py={"20px"}
              height={"120px"}
              fontSize={"lg"}
            >
              {selectedFeature !== null
                ? transcribelyFeatures[selectedFeature]?.description
                : "Hover or click on a feature to see more details."}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </PageContainer>
  );
};

export default Features;

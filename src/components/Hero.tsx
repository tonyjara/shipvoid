import { heroContent } from "@/lib/Constants";
import { Text, Box, chakra, Heading, Flex } from "@chakra-ui/react";
import HeroScreens from "./HeroScreens";

const HeroPage = () => {
  return (
    <Flex
      pb={{ base: 20, md: 20 }}
      pt={{ base: 10, md: 0 }}
      alignItems={"center"}
      flexDir={{ base: "column", lg: "row" }}
      justifyContent={"space-evenly"}
      overflow={"hidden"}
      position={"relative"}
    >
      <Flex
        px={{ base: "0px", md: "20px" }}
        overflow={"hidden"}
        flexDir={"column"}
        maxW={"7xl"}
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
          zIndex={1}
        >
          {heroContent.description}
        </Text>
        {/* Manage depending on appOption */}
        <HeroScreens />
      </Flex>

      <Box
        maxW={"xl"}
        mt={{ base: "-100px", md: "0px" }}
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
export default HeroPage;

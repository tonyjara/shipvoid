import PageContainer from "@/components/Containers/PageContainer";
import { siteData, Faq } from "@/lib/Constants/SiteData";
import { socialMediaLinks } from "@/lib/Constants/SocialMedia";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Divider,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import React from "react";

const Faq = ({ faq }: { faq: Faq[] }) => {
  return (
    <PageContainer>
      <Flex
        w="full"
        flexDir={{ base: "column", md: "row" }}
        justifyContent={{ base: "center", md: "space-between" }}
        justifyItems={"center"}
        py={{ base: "0px", md: "40px" }}
      >
        <Flex
          flexDir={"column"}
          w="full"
          alignContent={"center"}
          alignItems={"center"}
          pt={"10px"}
          gap={"10px"}
        >
          <Heading>Frequently Asked Questions</Heading>
          <Text color={"gray.500"}>
            Have more questions? Reach out through{" "}
            <a
              target="_blank"
              href={socialMediaLinks.twitter}
              style={{ fontWeight: "bold" }}
            >
              twitter
            </a>{" "}
            or{" "}
            <a
              href={`mailto:${siteData.contactEmail}`}
              style={{ fontWeight: "bold" }}
            >
              email
            </a>
          </Text>
        </Flex>
        <Flex w="full" justifyContent={"start"}>
          <Accordion allowToggle w="full">
            {faq.map((q) => (
              <>
                <AccordionItem pt={"10px"} key={q.question}>
                  <AccordionButton>
                    <Flex justifyContent={"space-between"} w="full">
                      <Heading
                        fontWeight={"medium"}
                        fontSize={"xl"}
                        as="span"
                        flex="1"
                        textAlign="left"
                      >
                        {q.question}
                      </Heading>
                    </Flex>
                    <AccordionIcon fontSize={"3xl"} />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <Text>{q.answer}</Text>
                  </AccordionPanel>
                </AccordionItem>
                <Divider pt="10px" />
              </>
            ))}
          </Accordion>
        </Flex>
      </Flex>
    </PageContainer>
  );
};

export default Faq;

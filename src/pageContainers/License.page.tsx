import PageContainer from "@/components/Containers/PageContainer";
import Footer from "@/components/Hero/Footer";
import MetaTagsComponent from "@/components/Meta/MetaTagsComponent";
import { siteData } from "@/lib/Constants/SiteData";
import { Flex, UnorderedList, Heading, Text, ListItem } from "@chakra-ui/react";
import React from "react";

const LicensePage = () => {
  const H1 = ({ children }: { children: React.ReactNode }) => (
    <Heading fontSize={"4xl"} mt={"20px"}>
      {children}
    </Heading>
  );
  const H2 = ({ children }: { children: React.ReactNode }) => (
    <Heading fontSize={"3xl"} mt={"20px"}>
      {children}
    </Heading>
  );
  const H3 = ({ children }: { children: React.ReactNode }) => (
    <Heading fontSize={"2xl"} mt={"20px"}>
      {children}
    </Heading>
  );
  return (
    <>
      <MetaTagsComponent
        title="License"
        description="Learn what you can and can't do with the source code you'll get after your purchase."
      />
      <PageContainer className="flex flex-row justify-center">
        <Flex
          maxW={"900px"}
          w="full"
          gap={"15px"}
          flexDir={"column"}
          pb={"40px"}
          pt={"20px"}
        >
          <Text color={"brand.500"}>Current as of Nov 12, 2023</Text>
          <H1>{siteData.appName} License</H1>
          <Text fontSize={"xl"}>
            Learn what you can and can't do with the source code you'll get
            after your purchase.
          </Text>

          <Text fontWeight={"bold"}>
            By purchasing any of our products, you agree to be bound by this
            license agreement.
          </Text>

          <Text my={"20px"} color={"brand.500"} fontSize={"xl"}>
            Summary: Build unlimited apps as a team or individual. You can't
            resell or redistribute the source code as a template, starter or
            boilerplate. You can't share your access with anyone outside your
            team.
          </Text>
          <H2>Single user License</H2>
          <Text>
            The creators of {siteData.appName} grant you an ongoing,
            non-exclusive license to use this app or any of it's components.
          </Text>
          <Text>
            The license grants permission to{" "}
            <span style={{ fontWeight: "bold" }}>one individual</span> (the
            Licensee) to access and use the source code and it's components.
          </Text>
          <Text fontWeight={"bold"}>
            The license is non-transferable and is limited to the Licensee only.
          </Text>
          <H3>What you can do</H3>
          <UnorderedList>
            <ListItem>
              You may create unlimited End Products for personal of commercial
              use.
            </ListItem>
            <ListItem>
              You may use the End Product in a product offered for sale,
              provided the End Product does not allow for the extraction of the
              original source code.
            </ListItem>
            <ListItem>
              You may modify the contents of this app to create derivative
              applications. The resulting works are subject to the terms of this
              license.
            </ListItem>
          </UnorderedList>

          {/* NOTE: CANT DO */}

          <H3>What you can't do</H3>
          <UnorderedList>
            <ListItem>
              You may not redistribute or resell the source code or any of it's
              components.
            </ListItem>
            <ListItem>
              You may not use to directly compete with this product.
            </ListItem>
            <ListItem>
              You can't share your access to the code with any other
              individuals.
            </ListItem>
            <ListItem>
              You may not create resell or redistribute as a template or
              starter.
            </ListItem>
            <ListItem>
              You may not distribute as an open sourced product.
            </ListItem>
          </UnorderedList>
          <H3>Example Usage</H3>
          <Text>
            Examples of uses <span style={{ fontWeight: "bold" }}>allowed</span>{" "}
            by the license:
          </Text>
          <UnorderedList>
            <ListItem>Creating a product for your company</ListItem>
            <ListItem>
              Creating an end product for a client that will be owned by that
              client
            </ListItem>
            <ListItem>
              Creating a commercial application similar to the one purchased.
            </ListItem>
            <ListItem>
              Creating a commercial self-hosted application that is sold to end
              users for a one-time fee.
            </ListItem>
          </UnorderedList>
          <Text>
            Examples of usage{" "}
            <span style={{ fontWeight: "bold" }}>not allowed</span> by the
            license:
          </Text>
          <UnorderedList>
            <ListItem>
              Creating a public repository of your favorite parts of this
              product and publish it publicly.
            </ListItem>
            <ListItem>
              Sell this product as a starter or template in any platform or
              capacity.
            </ListItem>
            <ListItem>
              Creating any End Product that is not the sole property of either
              your company or your company's client. For example, your
              employees/contractors can't use your company's license to build
              their websites or side projects.
            </ListItem>
          </UnorderedList>
          <H3>Standard License Definitions</H3>
          <Text>
            <span style={{ fontWeight: "bold" }}>Licensee</span> is the
            individual who has purchased a Standard License.
          </Text>
          <Text>
            <span style={{ fontWeight: "bold" }}>The product/s</span> is the
            source code made available to the Licensee after a license.
          </Text>

          <Text>
            <span style={{ fontWeight: "bold" }}>End Product</span> is any
            artifact produced that incorporates the product or derivatives of
            the product.
          </Text>

          <Text>
            <span style={{ fontWeight: "bold" }}>End User</span> is a user of an
            End Product.
          </Text>

          <Text>
            <span style={{ fontWeight: "bold" }}>Client</span> is an individual
            or entity receiving custom professional services directly from the
            Licensee, produced specifically for that individual or entity.
            Customers of software-as-a-service products are not considered
            clients for the purpose of this document.
          </Text>

          <H2>Team License</H2>

          <Text>
            The creators of {siteData.appName} grant you an ongoing,
            non-exclusive license to use the product/s.
          </Text>

          <Text>
            The license grants permission to all Employees and Contractors of
            the Licensee to access and use the product/s.
          </Text>

          {/* NOTE: CAN DO */}

          <H3>What you can do</H3>
          <UnorderedList>
            <ListItem>
              You may create unlimited End Products for personal of commercial
              use.
            </ListItem>
            <ListItem>
              You may use the End Product in a product/s offered for sale,
              provided the End Product does not allow for the extraction of the
              original source code.
            </ListItem>
            <ListItem>
              You may modify the contents of this app to create derivative
              applications. The resulting works are subject to the terms of this
              license.
            </ListItem>
          </UnorderedList>

          {/* NOTE: CANT DO */}

          <H3>What you can't do</H3>
          <UnorderedList>
            <ListItem>
              You may not redistribute or resell the source code or any of it's
              components.
            </ListItem>
            <ListItem>
              You may not use to directly compete with this product/s.
            </ListItem>
            <ListItem>
              You can't share your access to the code with any other individuals
              outside your team.
            </ListItem>
            <ListItem>
              You may not create resell or redistribute as a template or
              starter.
            </ListItem>
            <ListItem>
              You may not distribute as an open sourced product.
            </ListItem>
          </UnorderedList>

          <Text>
            Examples of usage{" "}
            <span style={{ fontWeight: "bold" }}>not allowed</span> by the
            license:
          </Text>
          <UnorderedList>
            <ListItem>
              Creating a public repository of your favorite parts of this
              product/s and publish it publicly.
            </ListItem>
            <ListItem>
              Sell this product/s as a starter or template in any platform or
              capacity.
            </ListItem>
            <ListItem>
              Creating any End Product that is not the sole property of either
              your company or your company's client. For example, your
              employees/contractors can't use your company's license to build
              their websites or side projects.
            </ListItem>
          </UnorderedList>
          <H3>Team License Definitions</H3>
          <Text>
            <span style={{ fontWeight: "bold" }}>Licensee</span> is the business
            entity who has purchased a Team License.
          </Text>
          <Text>
            <span style={{ fontWeight: "bold" }}>The product/s</span> is the
            source code made available to the Licensee after a license.
          </Text>

          <Text>
            <span style={{ fontWeight: "bold" }}>End Product</span> is any
            artifact produced that incorporates the product/s or derivatives of
            the product/s.
          </Text>

          <Text>
            <span style={{ fontWeight: "bold" }}>End User</span> is a user of an
            End Product.
          </Text>

          <Text>
            <span style={{ fontWeight: "bold" }}>Client</span> is an individual
            or entity receiving custom professional services directly from the
            Licensee, produced specifically for that individual or entity.
            Customers of software-as-a-service products are not considered
            clients for the purpose of this document.
          </Text>

          <H2>Enforcement</H2>
          <Text>
            The copyright of the product/s is owned by the creators of{" "}
            {siteData.appName}. You are granted only the permissions described
            in each license - all other rights are reserved. The creators of{" "}
            {siteData.appName} reserve the right to pursue legal remedies for
            any unauthorized use of the product/s outside the scope of this
            license.
          </Text>

          <H2>Warranty</H2>
          <Text>
            The product/s are provided "as is" without warranty of any kind,
            express or implied, including but not limited to the warranties of
            merchantability, fitness for a particular purpose and
            noninfringement. In no event shall the authors or copyright holders
            be liable for any claim, damages or other liability, whether in an
            action of contract, tort or otherwise, arising from, out of or in
            connection with the product/s or the use or other dealings in the
            product/s.
          </Text>

          <H2>Liability</H2>
          <Text>
            The creators of {siteData.appName} shall not be held liable for any
            damages, including, but not limited to, direct, indirect, special,
            incidental or consequential damages or other losses arising out of
            the use of or inability to use the product/s.
          </Text>

          <H2>Refund Policy</H2>
          <Text>
            Because of the nature of the product/s and to prevent refund abuse
            we <span style={{ fontWeight: "bold" }}>do NOT</span> offer refunds.
            We urge you to visit the documentation site and watch the tutorial
            videos and overviews before making a purchase. Scheduling a demo is
            also available if you have any questions.
          </Text>
        </Flex>
      </PageContainer>
      <Footer />
    </>
  );
};

export default LicensePage;

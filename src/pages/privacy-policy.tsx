import PageContainer from "@/components/Containers/PageContainer";
import Footer from "@/components/Hero/Footer";
import MetaTagsComponent from "@/components/Meta/MetaTagsComponent";
import { siteData } from "@/lib/Constants/SiteData";
import { Box, Flex, Heading, Image } from "@chakra-ui/react";
import React from "react";

const PrivacyPolicy = () => {
  return (
    <>
      <MetaTagsComponent
        title="Privacy Policy"
        description={`Privacy policy page for ${siteData.appName}`}
      />
      <PageContainer>
        <Box display={"flex"} justifyContent={"center"}>
          <Box maxW={"800px"} width={"100%"}>
            <Flex alignItems={"center"} gap={"20px"}>
              <Image
                src={siteData.logo}
                alt="logo"
                width={"30px"}
                height={"30px"}
                cursor="pointer"
                hideBelow={"md"}
              />
              <Heading>
                <strong>{siteData.appName.toUpperCase()} Privacy policy</strong>
              </Heading>
            </Flex>
            <br />
            <strong>Effective Date: August 30, 2023</strong>
            <br />
            <br />

            <strong>1. Introduction</strong>

            <p>
              Welcome to {siteData.appName} ("we", "us", or "our"). We are
              committed to protecting the privacy and security of your personal
              information. This Privacy Policy outlines how we collect, use,
              disclose, and protect the information you provide to us through
              our website, <a href={siteData.prodUrl}>{siteData.appName}</a>{" "}
              ("Website"). By using our Website, you consent to the practices
              described in this policy.
            </p>

            <br />
            <strong>2. Information We Collect</strong>
            <br />

            <p>
              We may collect the following types of information when you
              interact with our Website:
            </p>
            <br />

            <ul>
              <li>
                <strong>Personal Information:</strong> This includes information
                you provide to us, such as your name, email address, and any
                other information you choose to provide when contacting us
                through our contact email{" "}
                <a href={`mailto:${siteData.contactEmail}`}>
                  {siteData.contactEmail}
                </a>
                .
              </li>
              <br />
              <li>
                <strong>Usage Information:</strong> We may collect non-personal
                information about how you interact with our Website. This may
                include your IP address, browser type, operating system,
                referring URLs, and other technical information.
              </li>
            </ul>
            <br />
            <strong>3. How We Use Your Information</strong>

            <p>
              We use the information we collect for various purposes, including:
            </p>

            <ul>
              <li>
                - Responding to your inquiries and providing customer support.
              </li>
              <li>
                - Sending you relevant updates, newsletters, and promotional
                materials if you've opted in to receive them.
              </li>
              <li>
                - Analyzing and improving the functionality and user experience
                of our Website.
              </li>
              <li>
                - Protecting our rights and complying with legal obligations.
              </li>
            </ul>

            <br />
            <strong>4. Data retention</strong>
            <br />

            <p>
              We retain personal information we collect from you where we have
              an ongoing legitimate business need to do so (for example, to
              provide you with a service you have requested or to comply with
              applicable legal, tax, or accounting requirements).
            </p>

            <br />
            <strong>5. Cookies and Tracking Technologies</strong>
            <br />

            <p>
              Our Website may use cookies and similar tracking technologies to
              enhance your experience and collect information about how you use
              the site. You can manage your cookie preferences through your
              browser settings.
            </p>

            <br />
            <strong>6. Disclosure of Information</strong>
            <br />

            <p>
              We do not sell, trade, or otherwise transfer your personal
              information to third parties without your explicit consent.
              However, we may share information with trusted service providers
              who assist us in operating our Website and conducting our
              business.
            </p>

            <br />
            <strong>7. Your Rights</strong>
            <br />

            <p>
              You have the right to access, correct, update, or delete the
              personal information we hold about you. You can do this by
              contacting us at{" "}
              <a href={`mailto:${siteData.contactEmail}`}>
                {siteData.contactEmail}
              </a>
              .
            </p>

            <br />
            <strong>8. Security</strong>
            <br />

            <p>
              We implement reasonable security measures to protect your personal
              information from unauthorized access, disclosure, or destruction.
            </p>

            <br />
            <strong>9. Changes to this Privacy Policy</strong>
            <br />

            <p>
              We may update this Privacy Policy from time to time. The latest
              version will always be available on our Website. Existing users
              will be notified by email of any changes to this policy.
            </p>

            <br />
            <strong>10. Service Providers</strong>
            <br />

            <p>
              [I/We] may employ third-party companies and individuals due to the
              following reasons: To facilitate our Service; To provide the
              Service on our behalf; To perform Service-related services; or To
              assist us in analyzing how our Service is used. [I/We] want to
              inform users of this Service that these third parties have access
              to their Personal Information. The reason is to perform the tasks
              assigned to them on our behalf. However, they are obligated not to
              disclose or use the information for any other purpose.{" "}
            </p>

            <br />
            <strong>11. Links to Other Sites</strong>
            <br />

            <p>
              This Service may contain links to other sites. If you click on a
              third-party link, you will be directed to that site. Note that
              these external sites are not operated by [me/us]. Therefore,
              [I/We] strongly advise you to review the Privacy Policy of these
              websites. [I/We] have no control over and assume no responsibility
              for the content, privacy policies, or practices of any third-party
              sites or services.{" "}
            </p>

            <br />
            <strong>12. Children's privacy</strong>
            <br />

            <p>
              These Services do not address anyone under the age of 13. [I/We]
              do not knowingly collect personally identifiable information from
              children under 13 years of age. In the case [I/We] discover that a
              child under 13 has provided [me/us] with personal information,
              [I/We] immediately delete this from our servers. If you are a
              parent or guardian and you are aware that your child has provided
              us with personal information, please contact [me/us] so that
              [I/We] will be able to do the necessary actions.{" "}
            </p>

            <br />
            <strong>13. Contact Us</strong>
            <br />

            <p>
              If you have any questions or concerns regarding this Privacy
              Policy or our privacy practices, please contact us at{" "}
              <a href={`mailto:${siteData.contactEmail}`}>
                {siteData.contactEmail}
              </a>
              .
            </p>
            <br />
            <br />
            <br />
            <br />
            <br />
          </Box>
        </Box>
      </PageContainer>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;

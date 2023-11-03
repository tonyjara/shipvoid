import { siteData } from "@/lib/Constants";
import { Box, Heading } from "@chakra-ui/react";
import React from "react";

const TermsOfService = () => {
  return (
    <Box display={"flex"} justifyContent={"center"}>
      <Box maxW={"800px"} width={"100%"}>
        <Heading>
          <strong>{siteData.appName.toUpperCase()} Privacy policy</strong>
        </Heading>
        <br />
        <strong>Effective Date: August 30, 2023</strong>
        <br />
        <br />

        <strong>1. Introduction</strong>

        <p>
          Welcome to {siteData.appName} ("we", "us", or "our"). We are committed
          to protecting the privacy and security of your personal information.
          This Privacy Policy outlines how we collect, use, disclose, and
          protect the information you provide to us through our website,{" "}
          <a href={siteData.prodUrl}>{siteData.appName}</a> ("Website"). By
          using our Website, you consent to the practices described in this
          policy.
        </p>

        <br />
        <strong>2. Information We Collect</strong>
        <br />

        <p>
          We may collect the following types of information when you interact
          with our Website:
        </p>
        <br />

        <ul>
          <li>
            <strong>Personal Information:</strong> This includes information you
            provide to us, such as your name, email address, and any other
            information you choose to provide when contacting us through our
            contact email{" "}
            <a href={`mailto:${siteData.contactEmail}`}>
              {siteData.contactEmail}
            </a>
            .
          </li>
          <br />
          <li>
            <strong>Usage Information:</strong> We may collect non-personal
            information about how you interact with our Website. This may
            include your IP address, browser type, operating system, referring
            URLs, and other technical information.
          </li>
        </ul>
        <br />
        <strong>3. How We Use Your Information</strong>

        <p>
          We use the information we collect for various purposes, including:
        </p>

        <ul>
          <li>Responding to your inquiries and providing customer support.</li>
          <li>
            Sending you relevant updates, newsletters, and promotional materials
            if you've opted in to receive them.
          </li>
          <li>
            Analyzing and improving the functionality and user experience of our
            Website.
          </li>
          <li>Protecting our rights and complying with legal obligations.</li>
        </ul>

        <br />
        <strong>4. Cookies and Tracking Technologies</strong>
        <br />

        <p>
          Our Website may use cookies and similar tracking technologies to
          enhance your experience and collect information about how you use the
          site. You can manage your cookie preferences through your browser
          settings.
        </p>

        <br />
        <strong>5. Disclosure of Information</strong>
        <br />

        <p>
          We do not sell, trade, or otherwise transfer your personal information
          to third parties without your explicit consent. However, we may share
          information with trusted service providers who assist us in operating
          our Website and conducting our business.
        </p>

        <br />
        <strong>6. Your Rights</strong>
        <br />

        <p>
          You have the right to access, correct, update, or delete the personal
          information we hold about you. You can do this by contacting us at{" "}
          <a href={`mailto:${siteData.contactEmail}`}>
            {siteData.contactEmail}
          </a>
          .
        </p>

        <br />
        <strong>7. Security</strong>
        <br />

        <p>
          We implement reasonable security measures to protect your personal
          information from unauthorized access, disclosure, or destruction.
        </p>

        <br />
        <strong>8. Changes to this Privacy Policy</strong>
        <br />

        <p>
          We may update this Privacy Policy from time to time. The latest
          version will always be available on our Website.
        </p>

        <br />
        <strong>9. Contact Us</strong>
        <br />

        <p>
          If you have any questions or concerns regarding this Privacy Policy or
          our privacy practices, please contact us at{" "}
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
  );
};

export default TermsOfService;

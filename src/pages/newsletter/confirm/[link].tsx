import {
  Flex,
  Stack,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { type GetServerSideProps } from "next";
import { verifyToken } from "@/lib/utils/asyncJWT";
import { prisma } from "@/server/db";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export default function ConfirmNewsLetter(props: {
  email: string;
  name: string;
}) {
  const router = useRouter();
  const headingColor = useColorModeValue("brand.500", "brand.400");
  const [redirectSeconds, setRedirectSeconds] = React.useState(5);

  useEffect(() => {
    if (redirectSeconds == 0) {
      router.push("/home");
      return;
    }

    setTimeout(() => {
      setRedirectSeconds((redirectSeconds) => redirectSeconds - 1);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirectSeconds]);

  return (
    <Flex
      minH={"92vh"}
      flexDir={"column"}
      align={"center"}
      justify={"start"}
      bg={useColorModeValue("gray.50", "gray.800")}
      w="full"
      px="20px"
    >
      <Stack spacing={8} py={{ base: 6, md: 12 }}>
        <Stack align={"center"}>
          <Heading color={headingColor} fontSize={"4xl"} textAlign={"center"}>
            {`Your email has been successfully verified, ${props?.name ?? ""}!`}
          </Heading>
          <Text fontSize={"xl"}>
            You'll be redirected to the home page in a few seconds.
          </Text>
        </Stack>
      </Stack>
    </Flex>
  );
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = ctx.query.link as string | null;
  const secret = process.env.JWT_SECRET;
  if (!secret || !token) {
    return { notFound: true };
  }

  const verify = await verifyToken(token, secret).catch((err) => {
    console.error("Verify err: " + JSON.stringify(err));
  });

  if (verify && "data" in verify) {
    const row = await prisma.mailingList.findUnique({
      where: { confirmationId: verify.data.confirmationId },
    });
    if (!row || row.hasConfirmed) {
      return {
        notFound: true,
      };
    }
    await prisma.mailingList.update({
      where: { id: row.id },
      data: { hasConfirmed: true },
    });

    return {
      props: {
        name: row.name,
        email: row.email,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

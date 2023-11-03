import React from "react";
import {
  Box,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { handleUseMutationAlerts } from "@/components/Alerts/MyToast";
import type { GetServerSideProps } from "next";
import { verifyToken } from "@/lib/utils/asyncJWT";
import { zodResolver } from "@hookform/resolvers/zod";
import { knownErrors } from "@/lib/dictionaries/knownErrors";
import FormControlledText from "@/components/Forms/FormControlled/FormControlledText";
import { prisma } from "@/server/db";
import { z } from "zod";
import { trpcClient } from "@/utils/api";

interface PasswordRecoveryForm {
  password: string;
  confirmPassword: string;
  token: string;
  linkId: string;
  email: string;
  userId: string;
}

export const validatePasswordRecovery = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    token: z.string().min(1),
    linkId: z.string().min(1),
    email: z.string().min(1),
    userId: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

interface VerifyLinkPageData {
  email: string;
  displayName: string;
  linkId: string;
  userId: string;
}

export default function VerifyLinkPage(props: {
  token: string;
  data: VerifyLinkPageData;
}) {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PasswordRecoveryForm>({
    resolver: zodResolver(validatePasswordRecovery),
    defaultValues: {
      linkId: props.data.linkId,
      email: props.data.email,
      userId: props.data.userId,
      token: props.token,
      password: "",
      confirmPassword: "",
    },
  });
  const { error, mutate, isLoading } =
    trpcClient.auth.assignPasswordFromRecovery.useMutation(
      handleUseMutationAlerts({
        successText:
          "Password changed successfully, you'll be redirected to the signin page",
        callback: async () => {
          router.push("/signin");
        },
      }),
    );

  const submitForm = async (data: PasswordRecoveryForm) => {
    mutate(data);
  };

  return (
    <form
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
      }}
      onSubmit={handleSubmit(submitForm)}
      noValidate
    >
      <Box display={"flex"} flexDir="column" py={{ base: 5, md: 10 }}>
        <Heading
          textAlign={"center"}
          py={{ base: 0, md: 5 }}
          fontSize={{ base: "2xl", md: "4xl" }}
          whiteSpace="break-spaces"
        >
          Passwor change for: {props?.data?.email}
        </Heading>

        <Box
          rounded={"lg"}
          bg={{
            base: "-moz-initial",
            md: useColorModeValue("white", "gray.700"),
          }}
          boxShadow={{ base: "none", md: "lg" }}
          p={5}
          minW={{ base: "full", md: "lg" }}
          maxW="xl"
          alignSelf={"center"}
        >
          {error && <Text color="red.300">{knownErrors(error.message)}</Text>}
          <Stack spacing={2}>
            <FormControlledText
              label={"Contraseña"}
              errors={errors}
              control={control}
              name="password"
              type="password"
            />
            <FormControlledText
              label={"Confirme su contraseña"}
              errors={errors}
              control={control}
              name="confirmPassword"
              type="password"
            />

            <Stack spacing={5}>
              <Stack
                spacing={5}
                textAlign={"center"}
                direction={{ base: "column" }}
              >
                <Button
                  isDisabled={isLoading || isSubmitting}
                  type="submit"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Guardar
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </form>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = ctx.query.link as string | null;
  const secret = process.env.JWT_SECRET;
  if (!secret || !token) {
    return { notFound: true };
  }

  const verify = (await verifyToken(token, secret).catch((err) => {
    console.error("Verify err: " + JSON.stringify(err));
  })) as {
    data: VerifyLinkPageData;
  } | null;

  if (verify && "data" in verify) {
    const verifyLink = await prisma?.passwordRecoveryLinks.findUnique({
      where: { id: verify.data.linkId },
    });
    if (verifyLink?.hasBeenUsed) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        data: verify.data,
        token,
      },
    };
  } else {
    return {
      notFound: true,
    };
  }
};

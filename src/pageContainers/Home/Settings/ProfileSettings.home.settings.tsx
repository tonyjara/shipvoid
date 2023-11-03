import FormControlledAvatarUpload from "@/components/Forms/FormControlled/FormControlledAvatarUpload";
import FormControlledText from "@/components/Forms/FormControlled/FormControlledText";
import { handleUseMutationAlerts } from "@/components/Alerts/MyToast";
import {
  ProfileEditValues,
  defaultProfileEditValues,
  validateProfileEdit,
} from "@/lib/Validations/ProfileEdit.validate";
import { trpcClient } from "@/utils/api";
import {
  Button,
  Flex,
  Stack,
  useColorModeValue,
  HStack,
  Heading,
  Box,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function UserProfileEdit() {
  const user = useSession().data?.user;

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileEditValues>({
    defaultValues: defaultProfileEditValues,
    resolver: zodResolver(validateProfileEdit),
  });

  useEffect(() => {
    if (!user?.name || !user?.image) return;
    reset({
      name: user.name,
      avatarUrl: user.image,
    });

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const { mutate } = trpcClient.users.updateProfile.useMutation(
    handleUseMutationAlerts({
      successText: "Profile updated, please relog to see changes",
      callback: () => {},
    }),
  );
  const submitFunc = async (data: ProfileEditValues) => {
    mutate(data);
  };
  const headingColor = useColorModeValue("brand.500", "brand.400");
  return (
    <form onSubmit={handleSubmit(submitFunc)} noValidate>
      <Flex
        minH={"85vh"}
        align={"start"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack
          spacing={8}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.700")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          mt={12}
          alignItems={"center"}
        >
          <Heading
            color={headingColor}
            lineHeight={1.1}
            fontSize={{ base: "2xl", sm: "3xl" }}
          >
            Edit Profile
          </Heading>
          <Box>
            {user && (
              <FormControlledAvatarUpload
                control={control}
                errors={errors}
                urlName="avatarUrl"
                setValue={setValue}
                userId={user?.id}
              />
            )}
          </Box>

          <HStack>
            <FormControlledText
              isRequired
              control={control}
              name="name"
              label="Name"
              errors={errors}
            />
          </HStack>
          <Button
            color={"white"}
            isDisabled={isSubmitting}
            type="submit"
            w="full"
            _hover={{
              bg: "brand.600",
            }}
            _dark={{ color: "gray.800" }}
          >
            Save Changes
          </Button>
        </Stack>
      </Flex>
    </form>
  );
}

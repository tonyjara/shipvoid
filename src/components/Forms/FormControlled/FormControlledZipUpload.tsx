import {
  Text,
  FormControl,
  FormHelperText,
  FormErrorMessage,
  Icon,
  VisuallyHidden,
  useColorModeValue,
  HStack,
  VStack,
  FormLabel,
  Spinner,
  Flex,
  Progress,
  Box,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  type Control,
  UseFormSetValue,
  useWatch,
  FieldErrors,
} from "react-hook-form";
import axios from "axios";
import { myToast } from "@/components/Alerts/MyToast";
import { uploadFileToBlobStorage } from "@/lib/utils/azure-storage-blob";
import { appOptions } from "@/lib/Constants/AppOptions";
import { DownloadableProduct, PlatformProduct } from "@prisma/client";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { BsFileZip } from "react-icons/bs";

interface props {
  control: Control<DownloadableProduct>;
  errors: FieldErrors<DownloadableProduct>;
  helperText?: string;
  label?: string;
  setValue: UseFormSetValue<DownloadableProduct>;
  platformProductName: PlatformProduct;
}

const FormControlledZipUpload = (props: props) => {
  const { control, platformProductName, errors, label, setValue, helperText } =
    props;
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const blobName = useWatch({ control, name: "blobName" });

  const handleZipUpload = async (files: File[]) => {
    try {
      if (!files[0]) return;

      const fileName = files[0].name.split(".").shift();
      if (!fileName) return;

      const fileExtension = files[0].name.split(".").pop();
      let slug = `${`${fileName}-${platformProductName.toLowerCase()}`}.${fileExtension}`;

      const getFile: File = files[0];

      const file = new File([getFile], slug, {
        type: getFile.type,
        lastModified: getFile.lastModified,
      });

      setUploading(true);

      //NOTE: Azure Blob Storage

      if (appOptions.cloudStorageProvider === "azure") {
        const req = await axios("/api/get-connection-string");
        const { connectionString } = req.data;
        const handleProgress = (progress: number) => {
          setProgress((progress / file.size) * 100);
        };

        const blobStorageUrl = await uploadFileToBlobStorage({
          file,
          containerName: platformProductName.toLowerCase(),
          fileName: file.name,
          connectionString,
          onProgress: handleProgress,
        });

        if (!blobStorageUrl) {
          throw new Error(
            "Something went wrong uploading your file, please try again.",
          );
        }
      }

      //NOTE: AWS S3

      if (appOptions.cloudStorageProvider === "aws") {
        //NOTE: Make folder structure for AWS S3
        slug = `${platformProductName}/audio/${slug}`;

        const req = await axios(
          `/api/get-s3-presigned-url?fileName=${slug}&fileType=${file.type}`,
        );

        const { preSignedUrl } = req.data;

        const fileUpload = await axios.put(preSignedUrl, file, {
          onUploadProgress: (progressEvent) => {
            setProgress((progressEvent?.progress ?? 0.01) * 100);
          },
        });
        if (fileUpload.status !== 200 || !fileUpload.config.url) {
          throw new Error(
            "Something went wrong uploading your file, please try again.",
          );
        }
        /* const fileUrl = fileUpload.config.url.split("?")[0]; */
        /* if (!fileUrl) return; */
        /* url = fileUrl; */
      }

      setValue("blobName", slug);
      setValue("containerName", platformProductName);
      setUploading(false);
      setProgress(0);
    } catch (err) {
      myToast.error();
      console.error(err);
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => handleZipUpload(files),
    disabled: uploading,
    maxFiles: 1,
    multiple: false,
    accept: {
      "application/zip": [".zip"],
    },
  });
  const activeBg = useColorModeValue("gray.100", "gray.600");

  return (
    <FormControl isInvalid={!!errors["blobName"]}>
      <FormLabel fontSize={"md"} color={"gray.500"}>
        {label}
      </FormLabel>
      <HStack justifyContent={"center"}>
        <VStack
          px={6}
          py="5px"
          borderWidth={2}
          _dark={{
            color: "gray.500",
          }}
          h="100px"
          w="100%"
          textAlign={"center"}
          display={blobName ? "none" : "flex"}
          borderStyle="dashed"
          rounded="md"
          transition="background-color 0.2s ease"
          _hover={{ bg: activeBg }}
          bg={isDragActive ? activeBg : "transparent"}
          {...getRootProps()}
        >
          <Flex color={"gray.400"}>
            {!uploading && "Drag and drop or click to upload"}
            {uploading && <span>Uploading, one moment please.</span>}
            {uploading && <Spinner ml={"10px"} />}
          </Flex>
          {!uploading && (
            <Icon h="50px" w="50px">
              <AiOutlineCloudUpload />
            </Icon>
          )}
          <VisuallyHidden>
            <input {...getInputProps()} />
          </VisuallyHidden>
        </VStack>
        <Box
          display={blobName ? "flex" : "none"}
          transition="background-color 0.2s ease"
          _hover={{ opacity: 0.5 }}
          opacity={isDragActive || uploading ? 0.5 : 1}
          p={6}
          {...getRootProps()}
          flexDir={"column"}
          alignItems={"center"}
        >
          <BsFileZip style={{ fontSize: "80px" }} />
          <Text mt={"10px"}>{blobName}</Text>
          {uploading && <Spinner mt={"-190px"} size={"xl"} mb={"145px"} />}
          <VisuallyHidden>
            <input disabled={uploading} {...getInputProps()} />
          </VisuallyHidden>
        </Box>
      </HStack>
      {uploading && (
        <Progress value={progress} width={"100%"} size={"lg"} mt={"10px"} />
      )}

      {!errors.containerName?.message ? (
        <FormHelperText color={"gray.500"}>{helperText}</FormHelperText>
      ) : (
        <FormErrorMessage>{errors.containerName.message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default FormControlledZipUpload;

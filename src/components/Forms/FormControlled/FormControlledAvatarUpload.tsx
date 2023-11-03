import {
  FormControl,
  VisuallyHidden,
  useColorModeValue,
  FormLabel,
  Spinner,
  Avatar,
  Box,
  AvatarBadge,
  IconButton,
} from "@chakra-ui/react";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import type {
  Control,
  FieldValues,
  Path,
  SetFieldValue,
} from "react-hook-form";
import { useWatch } from "react-hook-form";
import axios from "axios";
import { myToast } from "@/components/Alerts/MyToast";
import { compressAvatar } from "@/lib/utils/ImageCompressor";
import { EditIcon } from "@chakra-ui/icons";
import { uploadFileToBlobStorage } from "@/lib/utils/azure-storage-blob";
import { appOptions } from "@/lib/Constants";
interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: any;
  urlName: Path<T>; // the url returned from azure
  label?: string;
  hidden?: boolean;
  setValue: SetFieldValue<T>;
  helperText?: string;
  userId: string;
}

const FormControlledAvatarUpload = <T extends FieldValues>(
  props: InputProps<T>,
) => {
  const { control, urlName, label, hidden, setValue, userId } = props;
  const [uploading, setUploading] = useState(false);
  const pictureUrl = useWatch({ control, name: urlName }) as string;

  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleImageUpload(acceptedFiles);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageUpload = async (files: File[]) => {
    try {
      if (!files[0]) return;
      setUploading(true);

      const getFile: File = files[0];
      //This way avatarurl is always the same
      const originalFile = new File([getFile], "avatarUrl", {
        type: getFile.type,
        lastModified: getFile.lastModified,
      });
      const compressed = await compressAvatar(originalFile);
      let fileName = `${userId}-avatar.${compressed.type.split("/")[1]}`;
      let url = "";

      //NOTE: Azure Blob Storage

      if (appOptions.cloudStorageProvider === "azure") {
        const req = await axios("/api/get-connection-string");
        const { connectionString } = req.data;
        const blobStorageUrl = await uploadFileToBlobStorage({
          file: compressed,
          containerName: userId,
          fileName: compressed.name,
          connectionString,
        });

        if (!blobStorageUrl) {
          throw new Error(
            "Something went wrong uploading your file, please try again.",
          );
        }
        url = blobStorageUrl;
      }

      //NOTE: AWS S3

      if (appOptions.cloudStorageProvider === "aws") {
        //NOTE: Make folder structure for AWS S3
        fileName = `${userId}/images/${fileName}`;

        const req = await axios(
          `/api/get-s3-presigned-url?fileName=${fileName}&fileType=${compressed.type}`,
        );
        const { preSignedUrl } = req.data;

        const fileUpload = await axios.put(preSignedUrl, compressed, {});
        if (fileUpload.status !== 200 || !fileUpload.config.url) {
          throw new Error(
            "Something went wrong uploading your file, please try again.",
          );
        }
        const fileUrl = fileUpload.config.url.split("?")[0];
        if (!fileUrl) return;
        url = fileUrl;
      }

      setValue(urlName, url);

      setUploading(false);
    } catch (err) {
      myToast.error();
      console.error(err);
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg"],
    },
  });
  const activeBg = useColorModeValue("gray.100", "gray.600");

  return (
    <FormControl px={6} py="5px" hidden={hidden}>
      <FormLabel fontSize={"md"} color={"gray.500"}>
        {label}
      </FormLabel>

      <Box
        display={uploading ? "none" : "block"}
        cursor={"pointer"}
        {...getRootProps()}
      >
        <Avatar
          src={pictureUrl?.length ? pictureUrl : undefined}
          width={100}
          height={100}
          _hover={{ bg: activeBg }}
          bg={isDragActive ? activeBg : "teal"}
        >
          <AvatarBadge
            as={IconButton}
            size="sm"
            rounded="full"
            aria-label="remove Image"
            icon={<EditIcon />}
          />
        </Avatar>
      </Box>
      {uploading && <Spinner size="xl" />}

      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
    </FormControl>
  );
};

export default FormControlledAvatarUpload;

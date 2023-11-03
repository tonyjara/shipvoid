import {
  FormControl,
  FormHelperText,
  FormErrorMessage,
  Icon,
  VisuallyHidden,
  useColorModeValue,
  HStack,
  VStack,
  FormLabel,
  Flex,
  Progress,
  Spinner,
} from "@chakra-ui/react";
import React, {  useState } from "react";
import { useDropzone } from "react-dropzone";
import type { Path, UseFormSetValue } from "react-hook-form";
import { AiOutlineCloudUpload } from "react-icons/ai";
import axios from "axios";
import { myToast } from "@/components/Alerts/MyToast";
import slugify from "slugify";
import { AudioFile } from "@prisma/client";
import extractPeaks from "webaudio-peaks";
import { uploadFileToBlobStorage } from "@/lib/utils/azure-storage-blob";
import { convertFileIfNotMp3 } from "@/lib/utils/FfmpegFileConversion";
import { appOptions } from "@/lib/Constants";

interface InputProps {
  errors: any;
  fieldName: Path<AudioFile>;
  label?: string;
  hidden?: boolean;
  setValue: UseFormSetValue<AudioFile>;
  helperText?: string;
  userId: string | undefined;
  scribeId: number;
  uploadCallback: () => void;
  isSubmitting?: boolean;
}

const FormControlledAudioUpload = (props: InputProps) => {
  const {
    fieldName,
    errors,
    label,
    hidden,
    setValue,
    helperText,
    userId,
    uploadCallback,
    isSubmitting,
    scribeId,
  } = props;
  const [uploading, setUploading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleAudioUpload = async (files: File[]) => {
    try {
      if (!files[0] || !userId) return;

      const fileName = files[0].name.split(".").shift();
      if (!fileName) return;
      const fileExtension = files[0].name.split(".").pop();
      let audioNameSlug = `${slugify(`${scribeId}-${fileName}-audio-file`, {
        lower: true,
      })}.${fileExtension}`;
      const getFile: File = files[0];
      const originalFile = new File([getFile], audioNameSlug, {
        type: getFile.type,
        lastModified: getFile.lastModified,
      });

      //NOTE: Convert to mp3 if not already

      const file = await convertFileIfNotMp3({
        file: originalFile,
        setIsConverting,
        setProgress,
      });

      //NOTE: Extract audio peaks for waveform visual

      let audioContext = new window.AudioContext();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const peakData = extractPeaks(audioBuffer, 10000, true);
      const peaks = Object.values(peakData.data[0] ?? []).map((x) => x);

      let duration = audioBuffer.duration;

      setUploading(true);

      let url = "";

      //NOTE: Azure Blob Storage

      if (appOptions.cloudStorageProvider === "azure") {
        const req = await axios("/api/get-connection-string");
        const { connectionString } = req.data;
        const handleProgress = (progress: number) => {
          setProgress((progress / file.size) * 100);
        };
        const blobStorageUrl = await uploadFileToBlobStorage({
          file,
          containerName: userId,
          fileName: file.name,
          connectionString,
          onProgress: handleProgress,
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
        audioNameSlug = `${userId}/audio/${audioNameSlug}`;

        const req = await axios(
          `/api/get-s3-presigned-url?fileName=${audioNameSlug}&fileType=${file.type}`,
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
        const fileUrl = fileUpload.config.url.split("?")[0];
        if (!fileUrl) return;
        url = fileUrl;
      }

      setValue("name", fileName);
      setValue("blobName", audioNameSlug);
      setValue("duration", Math.floor(duration));
      setValue("peaks", peaks);
      setValue("url", url);
      setValue("length", file.size);
      setValue("type", file.type);

      setUploading(false);
      setProgress(0);
      uploadCallback();
    } catch (err) {
      myToast.error();
      console.error(err);
      setUploading(false);
      setIsConverting(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files)=> handleAudioUpload(files),
    maxFiles: 1,
    multiple: false,
    disabled: uploading || isConverting || isSubmitting,
    accept: {
      "audio/mpeg": [".mp3"],
      "audio/wav": [".wav"],
      "video/mp4": [".mp4"],
    },
  });
  const activeBg = useColorModeValue("gray.100", "gray.600");

  const splitName = fieldName.split(".");
  const reduceErrors = splitName.reduce((acc: any, curr: any) => {
    if (!acc[curr]) return acc;
    if (isNaN(curr)) {
      return acc[curr];
    }
    return acc[parseInt(curr)];
  }, errors);

  return (
    <FormControl hidden={hidden} isInvalid={!!errors[fieldName]}>
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
          borderStyle="dashed"
          rounded="md"
          transition="background-color 0.2s ease"
          _hover={{ bg: activeBg }}
          bg={isDragActive ? activeBg : "transparent"}
          {...getRootProps()}
        >
          <Flex color={"gray.400"}>
            {!uploading && !isConverting && "Drag and drop or click to upload"}
            {isConverting && <span>Converting, one moment please.</span>}
            {uploading && <span>Uploading, one moment please.</span>}
            {uploading || (isConverting && <Spinner ml={"10px"} />)}
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
      </HStack>
      {(uploading || isConverting) && (
        <Progress value={progress} width={"100%"} size={"lg"} mt={"10px"} />
      )}

      {!reduceErrors.message ? (
        <FormHelperText color={"gray.500"}>{helperText}</FormHelperText>
      ) : (
        <FormErrorMessage>{reduceErrors.message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default FormControlledAudioUpload;

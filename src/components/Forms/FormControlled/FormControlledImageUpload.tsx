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
  Image,
  Box,
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
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
import { AiOutlineCloudUpload } from "react-icons/ai";
import axios from "axios";
import { myToast } from "@/components/Alerts/MyToast";
import { compressImage } from "@/lib/utils/ImageCompressor";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
import getCroppedImg from "@/lib/utils/CropImage";
import { uploadFileToBlobStorage } from "@/lib/utils/azure-storage-blob";
import { appOptions } from "@/lib/Constants";

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: any;
  label?: string;
  name: Path<T>;
  hidden?: boolean;
  setValue: SetFieldValue<T>;
  helperText?: string;
  userId: string;
  setImageIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  imageName: string | undefined; //This is used to replace an existing image with a new one.
  minW?: number;
}

const FormControlledImageUpload = <T extends FieldValues>(
  props: InputProps<T>,
) => {
  const {
    control,
    name,
    errors,
    label,
    hidden,
    setValue,
    helperText,
    userId,
    imageName,
    setImageIsLoading,
    minW,
  } = props;
  const [uploading, setUploading] = useState(false);
  const pictureUrl = useWatch({ control, name: name }) as string;
  const [fileUrl, setFileUrl] = useState<string | undefined>();
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [tooSmall, setTooSmall] = useState(false);

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();

  function readFile(file: File) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  }

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      if (minW && croppedAreaPixels.width < minW) {
        setTooSmall(true);
        return;
      }
      if (tooSmall) setTooSmall(false);

      setCroppedAreaPixels(croppedAreaPixels);
    },
    [minW, tooSmall],
  );
  const processCroppedImage = useCallback(async () => {
    try {
      if (!fileUrl) return;
      const croppedImage = await getCroppedImg(fileUrl, croppedAreaPixels);

      handleImageUpload(croppedImage as Blob);
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [croppedAreaPixels]);

  const onDrop = useCallback(async (files: File[]) => {
    /* handleImageUpload(acceptedFiles); */
    if (!files[0]) return;
    const getFile: File = files[0];
    const fileExtension = getFile.name.split(".").pop();
    const fileName = `${imageName}.${fileExtension}`;
    const file = new File([getFile], fileName, {
      type: getFile.type,
      lastModified: getFile.lastModified,
    });
    const fileUrl = (await readFile(file)) as string | undefined;

    setFileUrl(fileUrl);

    onOpen();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCloseCropperModal = () => {
    setFileUrl(undefined);
    onClose();
  };

  const handleImageUpload = async (blob: Blob) => {
    try {
      handleCloseCropperModal();
      setUploading(true);
      setImageIsLoading && setImageIsLoading(true);

      const compressed = await compressImage(blob as any);

      let fileName = imageName
        ? `${imageName}.${compressed.type.split("/")[1]}`
        : "";
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

      setValue(name, url, { shouldDirty: true });
      setUploading(false);
      setImageIsLoading && setImageIsLoading(false);
    } catch (err) {
      myToast.error();
      console.error(err);
      setUploading(false);
      setImageIsLoading && setImageIsLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: uploading,
    maxFiles: 1,
    multiple: false,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });
  const activeBg = useColorModeValue("gray.100", "gray.600");

  const splitName = name.split(".");
  const reduceErrors = splitName.reduce((acc: any, curr: any) => {
    if (!acc[curr]) return acc;
    if (isNaN(curr)) {
      return acc[curr];
    }
    return acc[parseInt(curr)];
  }, errors);

  return (
    <>
      <Modal
        size={{ base: "full", md: "4xl" }}
        isOpen={isOpen}
        onClose={handleCloseCropperModal}
      >
        <ModalOverlay />
        <ModalContent minH={{ base: "100vh", md: "100vh" }}>
          <Box
            padding="20px"
            backgroundColor={"orange.500"}
            position={"absolute"}
            top={"0px"}
            width={"100%"}
            alignItems={"center"}
            display={tooSmall ? "flex" : "none"}
            /* gap={"20px"} */
          >
            <Text fontWeight={"bold"}>
              The image is too small, it needs to be at least {minW} pixels
              square{" "}
            </Text>
          </Box>
          <Box
            position={"absolute"}
            top={"0"}
            left={"0"}
            right={"0"}
            bottom={"0"}
            marginBottom="100px"
            marginTop={tooSmall ? "65px" : "0"}
          >
            <Cropper
              image={fileUrl}
              crop={crop}
              zoom={zoom}
              maxZoom={4}
              aspect={1 / 1}
              restrictPosition={false}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </Box>
          <Box
            padding="20px"
            backgroundColor={"gray.800"}
            position={"absolute"}
            bottom={"80px"}
            width={"100%"}
            display={"flex"}
            alignItems={"center"}
            gap={"20px"}
          >
            <Button onClick={handleCloseCropperModal}>Close</Button>
            <Slider
              value={zoom * 30}
              onChange={(value) => {
                setZoom(value / 30);
              }}
              defaultValue={5}
              aria-label="slider-ex-1"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>{" "}
            <Button isDisabled={tooSmall} onClick={processCroppedImage}>
              Save
            </Button>
          </Box>
        </ModalContent>
      </Modal>
      <FormControl hidden={hidden} isInvalid={!!errors[name]}>
        <FormLabel fontSize={"md"}>{label}</FormLabel>
        <HStack justifyContent={"center"}>
          <VStack
            px={6}
            py="5px"
            borderWidth={2}
            _dark={{
              color: "gray.500",
            }}
            h="300px"
            textAlign={"center"}
            borderStyle="dashed"
            display={pictureUrl ? "none" : "flex"}
            rounded="md"
            transition="background-color 0.2s ease"
            _hover={{ bg: activeBg }}
            bg={isDragActive ? activeBg : "transparent"}
            {...getRootProps()}
          >
            <Flex color={"gray.400"}>
              {!uploading && "Drag and drop or click to upload"}
              {uploading && <span>Uploading, one moment please.</span>}
              {uploading && <Spinner ml={2} />}
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
            display={pictureUrl ? "flex" : "none"}
            transition="background-color 0.2s ease"
            _hover={{ opacity: 0.5 }}
            opacity={isDragActive || uploading ? 0.5 : 1}
            {...getRootProps()}
            flexDir={"column"}
            alignItems={"center"}
          >
            <Image
              style={{ borderRadius: "8px", objectFit: "cover" }}
              alt={"upload picture"}
              src={pictureUrl?.length ? pictureUrl : "/no-image.png"}
              width={300}
              height={300}
            />
            {uploading && <Spinner mt={"-190px"} size={"xl"} mb={"145px"} />}
            <VisuallyHidden>
              <input disabled={uploading} {...getInputProps()} />
            </VisuallyHidden>
          </Box>
        </HStack>

        {!reduceErrors.message ? (
          <FormHelperText color={"gray.500"}>{helperText}</FormHelperText>
        ) : (
          <FormErrorMessage>{reduceErrors.message}</FormErrorMessage>
        )}
      </FormControl>
    </>
  );
};

export default FormControlledImageUpload;

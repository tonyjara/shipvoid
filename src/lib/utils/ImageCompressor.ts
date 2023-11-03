import imageCompression from "browser-image-compression";

export const compressImage = async (file: File) => {
  const compressedImage = await imageCompression(file, {
    maxSizeMB: 0.4,
    maxWidthOrHeight: 3000,
    useWebWorker: true,
    alwaysKeepResolution: true,
  });

  return compressedImage;
};

export const compressAvatar = async (file: File) => {
  const compressedImage = await imageCompression(file, {
    maxSizeMB: 0.1,
    maxWidthOrHeight: 1000,
    useWebWorker: true,
  });

  return compressedImage;
};

export const compressFeedbackImage = async (file: File) => {
  const compressedImage = await imageCompression(file, {
    maxSizeMB: 0.3,
    useWebWorker: true,
  });

  return compressedImage;
};

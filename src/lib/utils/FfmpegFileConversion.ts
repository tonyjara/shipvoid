import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";

export const convertFileIfNotMp3 = async ({
  file,
  setIsConverting,
  setProgress,
}: {
  file: File;
  setIsConverting: (isConverting: boolean) => void;
  setProgress: (progress: number) => void;
}) => {
  if (file.type === "audio/mpeg") return file;

  if (file.type === "video/mp4" || file.type === "audio/wav") {
    setIsConverting(true);
    const ffmpeg = new FFmpeg();

    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm",
      ),
    });

    ffmpeg.on("progress", ({ progress }) => {
      setProgress(progress * 100);
    });

    if (file.type === "audio/wav") {
      await ffmpeg.writeFile("input.wav", await fetchFile(file));
      await ffmpeg.exec([
        "-i",
        "input.wav",
        "-vn",
        "-ar",
        "44100",
        "-ac",
        "2",
        "-b:a",
        "192k",
        "output.mp3",
      ]);
    }
    if (file.type === "video/mp4") {
      await ffmpeg.writeFile("input.mp4", await fetchFile(file));
      await ffmpeg.exec(["-i", "input.mp4", "-vn", "output.mp3"]);
    }
    const data = await ffmpeg.readFile("output.mp3");
    const blob = new Blob([data], { type: "audio/mpeg" }); // Set the correct MIME type
    const blobFile = new File([blob], file.name, { type: "audio/mpeg" });

    setIsConverting(false);
    setProgress(0);

    return blobFile;
  }

  throw new Error("File type not supported");
};

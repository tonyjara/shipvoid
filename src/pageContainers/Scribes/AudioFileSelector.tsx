import { Flex, Portal } from "@chakra-ui/react";
import React, { useRef } from "react";
import { trpcClient } from "@/utils/api";
import AudioSelectorAudioPlayer from "@/components/AudioPlayer/AudioSelector.audioPlayer";
import CollapsableContainer from "@/components/CollapsableContainer";
import FormControlledAudioUpload from "@/components/Forms/FormControlled/FormControlledAudioUpload";
import { handleUseMutationAlerts } from "@/components/Alerts/MyToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AudioFile } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import {
  defaultAudioFile,
  validateAudioFile,
} from "@/lib/Validations/Validate.AudioFile";

const AudioFileSelector = ({
  scribeId,
  collapseAll,
  setCollapseAll,
}: {
  scribeId: number;
  collapseAll: boolean;
  setCollapseAll: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const user = useSession().data?.user;
  const portalRef = useRef<HTMLDivElement>(null);
  const trpcContext = trpcClient.useUtils();

  const { data: audioFiles } =
    trpcClient.audioFiles.getScribeAudioFiles.useQuery(
      {
        scribeId,
      },
      {
        queryKey: ["audioFiles.getScribeAudioFiles", { scribeId }],
        refetchOnWindowFocus: false,
        enabled: !!scribeId,
      },
    );

  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AudioFile>({
    defaultValues: defaultAudioFile({
      scribeId,
    }),
    resolver: zodResolver(validateAudioFile),
  });
  const { mutate: createAudioFile, isLoading } =
    trpcClient.audioFiles.createAudioFileForScribe.useMutation(
      handleUseMutationAlerts({
        successText: "Audio file created successfully!",
        callback: () => {
          trpcContext.audioFiles.invalidate();
        },
      }),
    );
  const submitFunc = async (data: AudioFile) => {
    createAudioFile(data);
    reset(defaultAudioFile({ scribeId }));
  };

  return (
    <CollapsableContainer
      collapseAll={collapseAll}
      setCollapseAll={setCollapseAll}
      title="Audio File"
      tooltipText="Drop a file or click anywhere, we'll extract the audio from that file."
    >
      <Flex flexDir="column">
        <div ref={portalRef} />
        <Portal containerRef={portalRef}>
          {!audioFiles?.length && (
            <form onSubmit={handleSubmit(submitFunc)} noValidate>
              <Flex flexDir={"column"} gap={5}>
                <FormControlledAudioUpload
                  errors={errors}
                  fieldName="url"
                  setValue={setValue}
                  helperText="Supported file types: .mp3, .wav, .mp4"
                  userId={user?.id}
                  uploadCallback={() => handleSubmit(submitFunc)()}
                  scribeId={scribeId}
                  isSubmitting={isSubmitting || isLoading}
                />
              </Flex>
            </form>
          )}
        </Portal>
        {scribeId &&
          audioFiles?.map((audioFile) => {
            return (
              <AudioSelectorAudioPlayer
                key={audioFile.id}
                audioFile={audioFile}
              />
            );
          })}
      </Flex>
    </CollapsableContainer>
  );
};

export default AudioFileSelector;

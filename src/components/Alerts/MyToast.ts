import { toast } from "react-hot-toast";
import { knownErrors } from "@/lib/dictionaries/knownErrors";
export const myToast = {
  success: (text: string) => toast.success(text),
  error: (text?: string) =>
    toast.error(text ?? "Something went wrong, please try again."),
  loading: () => toast.loading("One moment please"),
  dismiss: () => toast.dismiss(),
  promise: async (text: string, promise: Promise<unknown>) =>
    toast.promise(
      promise,
      {
        loading: "One moment please...",
        success: text,
        error: "Error, please try again.",
      },
      {
        success: {
          duration: 3000,
          icon: "👌",
        },
      },
    ),
};

export const handleUseMutationAlerts = ({
  successText,
  callback,
}: {
  successText: string;
  callback?: (x: any, y: any, z: any) => void;
}) => {
  const loadToast = () => toast.loading("One moment please...");
  return {
    onError: (error: { message: string }) => {
      toast.dismiss();
      myToast.error(knownErrors(error.message));
    },
    //data is the return from the event
    onSuccess: (data: any, variables: any, context: any) => {
      toast.dismiss();
      myToast.success(successText);
      callback && callback(data, variables, context);
    },
    onMutate: () => loadToast(),
  };
};

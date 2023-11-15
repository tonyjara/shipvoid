import { myToast } from "@/components/Alerts/MyToast";
import { DownloadableProduct, PlatformProduct } from "@prisma/client";

export const downloadRelease = async ({
  platformProductName,
  release,
}: {
  platformProductName: PlatformProduct;
  release: DownloadableProduct;
}) => {
  try {
    myToast.loading();
    const res = await fetch("/api/download-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        containerName: release.containerName,
        blobName: release.blobName,
        platformProductName,
      }),
    });

    if (res.status !== 200) {
      const json = await res.json();
      throw new Error(json.error);
    }

    const blob = await res.blob();

    let a = document.createElement("a");
    a.download = release.blobName;
    a.rel = "noopener"; // tabnabbing
    a.href = window.URL.createObjectURL(blob);

    setTimeout(function () {
      window.URL.revokeObjectURL(a.href);
    }, 4e4); // 40s
    setTimeout(function () {
      a.dispatchEvent(new MouseEvent("click"));
    }, 0);

    myToast.dismiss();
    myToast.success("Downloaded file");
  } catch (err) {
    myToast.dismiss();
    if (err instanceof Error) {
      return myToast.error(err.message);
    }
    return myToast.error("Error downloading file, please try again later.");
  }
};

import { Button } from "@chakra-ui/react";
import React from "react";
import { myToast } from "./Alerts/MyToast";

export const AsyncExportDataToExcel = () => {
  const [loading, setLoading] = React.useState(false);

  const isSafari = () =>
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const getUsers = async () => {
    try {
      if (loading) return;

      setLoading(true);
      const res = await fetch("/api/download-emails-list", { method: "GET" });

      if (res.status !== 200) {
        const json = await res.json();
        throw new Error(json.error);
      }
      const json = await res.json();
      const emailsList = json.emailsList;

      const replacer = (key: string, value: string | null) =>
        value === null ? "" : value; // specify how you want to handle null values here
      const header = Object.keys(emailsList[0]);
      const csv = [
        header.join(","), // header row first
        ...emailsList.map((row: any) =>
          header
            .map((fieldName) => JSON.stringify(row[fieldName], replacer))
            .join(","),
        ),
      ].join("\r\n");

      const type = isSafari() ? "application/csv" : "text/csv";
      const blob = new Blob([csv], { type });

      let a = document.createElement("a");
      a.download = `emails-list-${new Date().toISOString()}.csv`;
      a.rel = "noopener"; // tabnabbing
      a.href = window.URL.createObjectURL(blob);

      setTimeout(function () {
        window.URL.revokeObjectURL(a.href);
      }, 4e4); // 40s
      setTimeout(function () {
        a.dispatchEvent(new MouseEvent("click"));
      }, 0);
      setLoading(false);
      myToast.success("Downloaded CSV");
    } catch (error) {
      console.error(error);
      setLoading(false);
      if (error instanceof Error) {
        return myToast.error(error.message);
      }
      return myToast.error("Error downloading list, please try again later.");
    }
  };

  return (
    <Button size={"sm"} isLoading={loading} onClick={getUsers}>
      Export as CSV
    </Button>
  );
};

export default AsyncExportDataToExcel;

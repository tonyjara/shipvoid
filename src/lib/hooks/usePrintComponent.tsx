import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const usePrintComponent = ({ callback }: { callback?: () => void }) => {
  const [isPrinting, setIsPrinting] = useState(false);
  const printRef = useRef(null);
  const promiseResolveRef = useRef<any>(null);
  // We watch for the state to change here, and for the Promise resolve to be available
  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      // Resolves the Promise, letting `react-to-print` know that the DOM updates are completed
      promiseResolveRef.current();
    }
  }, [isPrinting]);

  const handlePrint = useReactToPrint({
    documentTitle: `asdfasdf`,
    content: () => printRef.current,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        promiseResolveRef.current = resolve;
        setIsPrinting(true);
      });
    },
    onAfterPrint: () => {
      // Reset the Promise resolve so we can print again
      promiseResolveRef.current = null;
      setIsPrinting(false);
      callback && callback();
    },
  });
  return {
    handlePrint,
    isPrinting,
    printRef,
  };
};

export default usePrintComponent;

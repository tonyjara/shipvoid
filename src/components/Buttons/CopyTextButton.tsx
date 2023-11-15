import { Button, useClipboard } from "@chakra-ui/react";
import React from "react";

const CopyTextButton = ({
  copyValue,
  buttonText,
  disabled,
  className,
}: {
  copyValue: string;
  buttonText: string;
  disabled?: boolean;
  className?: string;
}) => {
  const { onCopy, hasCopied } = useClipboard(copyValue);

  return (
    <Button
      className={className}
      isDisabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onCopy();
      }}
    >
      {hasCopied ? "Copied!" : buttonText}
    </Button>
  );
};

export default CopyTextButton;

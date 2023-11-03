import { Button, useClipboard } from "@chakra-ui/react";
import React from "react";

const CopyLinkCellButton = ({
    link,
    disabled,
}: {
    link: string;
    disabled?: boolean;
}) => {
    const { onCopy, hasCopied } = useClipboard(link);

    return (
        <>
            <Button
                isDisabled={disabled}
                onClick={(e) => {
                    e.stopPropagation();
                    onCopy();
                }}
            >
                {hasCopied ? "Copiado!" : "Copiar"}
            </Button>
        </>
    );
};

export default CopyLinkCellButton;

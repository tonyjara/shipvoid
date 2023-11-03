import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";
import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import type ReactQuill from "react-quill";

const QuillWrapper = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    // eslint-disable-next-line react/display-name
    return ({ ...props }) => <RQ {...props} />;
  },
  {
    ssr: false,
  },
) as typeof ReactQuill;

interface InputProps<T extends FieldValues> {
  autoFocus?: boolean;
  control: Control<T>;
  errors: any;
  helperText?: string;
  hidden?: boolean;
  label?: string;
  maxLength?: number;
  name: Path<T>;
}

const FormControlledRichTextBlock = <T extends FieldValues>(
  props: InputProps<T>,
) => {
  const { control, name, errors, label, helperText, hidden } = props;

  const splitName = name.split(".");
  const reduceErrors = splitName.reduce((acc: any, curr: any) => {
    if (!acc[curr]) return acc;
    if (isNaN(curr)) {
      return acc[curr];
    }
    return acc[parseInt(curr)];
  }, errors);

  return (
    <FormControl hidden={hidden} isInvalid={!!reduceErrors.message}>
      {label && (
        <FormLabel fontSize={"md"} color={"gray.500"}>
          {label}
        </FormLabel>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <QuillWrapper
            style={{
              color: "black",
            }}
            theme="snow"
            value={field.value}
            onChange={field.onChange}
            modules={{
              clipboard: {
                matchVisual: false,
              },
            }}
          />
        )}
      />
      {!reduceErrors.message ? (
        <FormHelperText color={"gray.500"}>{helperText}</FormHelperText>
      ) : (
        <FormErrorMessage>{reduceErrors.message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default FormControlledRichTextBlock;

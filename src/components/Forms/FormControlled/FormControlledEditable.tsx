import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import {
  FormControl,
  Input,
  FormErrorMessage,
  ButtonGroup,
  Flex,
  IconButton,
  useEditableControls,
  EditableInput,
  Editable,
  EditablePreview,
} from "@chakra-ui/react";
import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  fontSize?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  errors: any;
  name: Path<T>;
  hidden?: boolean;
  autoFocus?: boolean;
}

const FormControlledEditableText = <T extends FieldValues>(
  props: InputProps<T>,
) => {
  const { control, name, errors, hidden, fontSize, autoFocus } = props;

  const splitName = name.split(".");
  const reduceErrors = splitName.reduce((acc: any, curr: any) => {
    if (!acc[curr]) return acc;
    if (isNaN(curr)) {
      return acc[curr];
    }
    return acc[parseInt(curr)];
  }, errors);
  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    return isEditing ? (
      <ButtonGroup justifyContent="center" size="sm">
        <IconButton
          aria-label="accept changes"
          icon={<CheckIcon />}
          {...getSubmitButtonProps()}
        />
        <IconButton
          aria-label="cancel changes"
          icon={<CloseIcon />}
          {...getCancelButtonProps()}
        />
      </ButtonGroup>
    ) : (
      <Flex justifyContent="center">
        <IconButton
          aria-label="edit filed"
          size="sm"
          icon={<EditIcon />}
          {...getEditButtonProps()}
        />
      </Flex>
    );
  }
  return (
    <FormControl hidden={hidden} isInvalid={!!reduceErrors.message}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Editable
            /* whiteSpace="pre-wrap" */
            onChange={field.onChange}
            value={field.value}
            fontSize={fontSize ?? "xl"}
            fontWeight={"bold"}
            isPreviewFocusable={false}
            flexDir={"row"}
            display={"flex"}
            alignItems={"center"}
            gap={2}
          >
            {/* Here is the custom input */}
            <Input
              as={EditableInput}
              value={field.value}
              onChange={field.onChange}
              autoFocus={autoFocus}
              borderColor={"gray.300"}
            />
            <EditableControls />
            <EditablePreview />
          </Editable>
        )}
      />
      {reduceErrors.message && (
        <FormErrorMessage>{reduceErrors.message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default FormControlledEditableText;

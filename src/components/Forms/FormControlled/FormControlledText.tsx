import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
  Textarea,
  InputRightElement,
} from "@chakra-ui/react";
import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

interface InputProps<T extends FieldValues> {
  autoFocus?: boolean;
  control: Control<T>;
  errors: any;
  helperText?: string;
  hidden?: boolean;
  inputLeft?: any;
  inputRight?: any;
  isRequired?: boolean;
  isTextArea?: boolean;
  label: string;
  maxLength?: number;
  maxW?: string;
  name: Path<T>;
  type?: string;
}

const FormControlledText = <T extends FieldValues>(props: InputProps<T>) => {
  const {
    control,
    name,
    errors,
    label,
    helperText,
    type,
    inputRight,
    maxLength,
    inputLeft,
    isTextArea,
    hidden,
    autoFocus,
    isRequired,
    maxW,
  } = props;

  const splitName = name.split(".");
  const reduceErrors = splitName.reduce((acc: any, curr: any) => {
    if (!acc[curr]) return acc;
    if (isNaN(curr)) {
      return acc[curr];
    }
    return acc[parseInt(curr)];
  }, errors);

  return (
    <FormControl
      isRequired={isRequired}
      hidden={hidden}
      isInvalid={!!reduceErrors.message}
      maxW={maxW}
    >
      <FormLabel fontSize={"md"}>{label}</FormLabel>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <InputGroup>
            {inputLeft && (
              <InputLeftElement pointerEvents={"none"}>
                {inputLeft}
              </InputLeftElement>
            )}
            {!isTextArea && (
              <Input
                // borderColor={"gray.300"}
                maxLength={maxLength}
                value={field.value}
                onChange={field.onChange}
                type={type}
                autoFocus={autoFocus}
              />
            )}
            {isTextArea && (
              <Textarea
                // borderColor={"gray.300"}
                maxLength={maxLength}
                value={field.value}
                onChange={field.onChange}
                autoFocus={autoFocus}
              />
            )}
            {inputRight && <InputRightElement>{inputRight}</InputRightElement>}
          </InputGroup>
        )}
      />
      {/* {error && <FormErrorMessage>{error}</FormErrorMessage>} */}
      {!reduceErrors.message ? (
        <FormHelperText color={"gray.500"}>{helperText}</FormHelperText>
      ) : (
        <FormErrorMessage>{reduceErrors.message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default FormControlledText;

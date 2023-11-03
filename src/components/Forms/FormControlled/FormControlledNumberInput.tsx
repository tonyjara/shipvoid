import {
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: any;
  name: Path<T>;
  label: string;
  helperText?: string;
  maxLength?: number;
  inputRight?: any;
  inputLeft?: any;
  prefix?: string;
  hidden?: boolean;
  disable?: boolean;
  maxW?: string;
}

const FormControlledNumberInput = <T extends FieldValues>({
  control,
  name,
  errors,
  label,
  helperText,
  inputRight,
  inputLeft,
  prefix,
  hidden,
  disable,
  maxLength,
  maxW,
}: InputProps<T>) => {
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
      display={hidden ? "none" : "block"}
      maxW={maxW}
      isInvalid={!!reduceErrors.message}
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
            <NumericFormat
              maxLength={maxLength}
              value={field.value}
              thousandSeparator=","
              decimalScale={2}
              prefix={prefix}
              onValueChange={(v: any) => {
                field.onChange(v?.floatValue ?? 0);
              }}
              onFocus={(e: any) => {
                e.target.select();
              }}
              customInput={Input}
              borderColor={"gray.300"}
              disabled={disable}
            />

            {inputRight}
          </InputGroup>
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

export default FormControlledNumberInput;

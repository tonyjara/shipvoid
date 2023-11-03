import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Checkbox,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import type { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  name: Path<T>;
  label?: string;
  labelComponent?: any;
  helperText?: string;
  type?: string;
  inputRight?: any;
}

const FormControlledCheckbox = <T extends FieldValues>({
  control,
  name,
  errors,
  label,
  helperText,
  labelComponent,
}: InputProps<T>) => {
  return (
    <FormControl isInvalid={!!errors[name]}>
      <Flex alignItems={"center"}>
        {label && <FormLabel>{label}</FormLabel>}
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Checkbox
              marginTop={-2}
              size={"lg"}
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {labelComponent}
      </Flex>
      {!errors[name] ? (
        <FormHelperText>{helperText}</FormHelperText>
      ) : (
        //@ts-ignore
        <FormErrorMessage>{errors[name].message}</FormErrorMessage>
      )}
    </FormControl>
  );
};

export default FormControlledCheckbox;

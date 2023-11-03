import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Flex,
  Switch,
} from "@chakra-ui/react";
import React from "react";
import type { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  name: Path<T>;
  label: string;
  helperText?: string;
  type?: string;
  inputRight?: any;
  disable?: boolean;
}

const FormControlledSwitch = <T extends FieldValues>({
  control,
  name,
  errors,
  label,
  helperText,
  disable,
}: InputProps<T>) => {
  return (
    <FormControl isInvalid={!!errors[name]}>
      <Flex alignItems={"center"} justifyContent="space-between">
        <FormLabel>{label}</FormLabel>
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Switch
              isDisabled={disable}
              marginTop={-2}
              size={"lg"}
              isChecked={field.value}
              onChange={field.onChange}
            />
          )}
        />
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

export default FormControlledSwitch;

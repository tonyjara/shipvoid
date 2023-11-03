import {
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Select,
} from "@chakra-ui/react";
import React from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  errors: any;
  name: Path<T>;
  label?: string;
  helperText?: string;
  placeholder?: string;
  options: { value: string; label: string }[] | any[];
  isClearable?: boolean;
  error?: string;
  disable?: boolean;
  value?: any;
}

const FormControlledSelect = <T extends FieldValues>({
  control,
  name,
  errors,
  label,
  options,
  helperText,
  error,
  placeholder,
}: InputProps<T>) => {
  const optionsWithEmpty = [
    { value: "", label: "Select an option" },
    ...options,
  ];
  return (
    <FormControl isInvalid={!!errors[name] || !!error}>
      {label && <FormLabel fontSize={"md"}>{label}</FormLabel>}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            placeholder={placeholder}
            onChange={(e) => {
              field.onChange(e.target.value);
            }}
            value={field.value}
          >
            {optionsWithEmpty.map((x) => (
              <option key={x.value} value={x.value}>
                {x.label}
              </option>
            ))}
          </Select>
        )}
      />
      {!errors[name] ? (
        <FormHelperText>{helperText}</FormHelperText>
      ) : (
        //@ts-ignore
        <FormErrorMessage>{errors[name].message}</FormErrorMessage>
      )}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default FormControlledSelect;

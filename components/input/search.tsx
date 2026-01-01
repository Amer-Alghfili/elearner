import React from "react";
import { Field, FieldProps } from "../ui/field";
import { Input, InputGroup } from "@chakra-ui/react";
import { SearchIcon } from "../Icons";
import { DebounceInput, DebounceInputProps } from "react-debounce-input";

type SearchInputProps = {
  icon?: React.ReactElement;
  debounceOptions?: Partial<
    DebounceInputProps<
      HTMLInputElement,
      React.InputHTMLAttributes<HTMLInputElement>
    >
  >;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
} & Omit<FieldProps, "onChange">;
export default function SearchInput({
  icon = <SearchIcon w="1.3em" h="1.3em" stroke="stroke.thick" />,
  onChange,
  placeholder,
  debounceOptions,
  ...props
}: SearchInputProps) {
  return (
    <Field maxW="22em" {...props}>
      <InputGroup startElement={icon}>
        <DebounceInput
          debounceTimeout={500}
          size="sm"
          placeholder={placeholder}
          element={Input}
          onChange={onChange}
          {...debounceOptions}
        />
      </InputGroup>
    </Field>
  );
}

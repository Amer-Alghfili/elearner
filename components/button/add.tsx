import { Button, ButtonProps, IconProps } from "@chakra-ui/react";
import React from "react";
import { PlusIcon } from "../Icons";

export type AddButtonProps = {
  iconProps?: IconProps;
  startWithIcon?: boolean;
} & ButtonProps;
export default function AddButton({
  children,
  iconProps,
  startWithIcon = true,
  ...props
}: AddButtonProps) {
  console.log(iconProps);
  return (
    <Button
      variant="plain"
      className="group"
      color="text.caption"
      fontWeight="bold"
      _hover={{ color: "text.primary" }}
      {...props}
    >
      {!startWithIcon && children}
      <PlusIcon
        fill="text.caption"
        stroke="text.caption"
        transition="all 0.2s ease-in-out"
        _groupHover={{ fill: "text.primary", stroke: "text.primary" }}
        strokeWidth="0.4"
        {...iconProps}
      />{" "}
      {startWithIcon && children}
    </Button>
  );
}

import { Button, ButtonProps, IconProps } from "@chakra-ui/react";
import React from "react";
import { PlusIcon } from "../Icons";

export default function AddButton({
  children,
  iconProps,
  ...props
}: { iconProps?: IconProps } & ButtonProps) {
  return (
    <Button
      variant="plain"
      className="group"
      color="text.caption"
      fontWeight="bold"
      px={0}
      _hover={{ color: "text.primary" }}
      {...props}
    >
      <PlusIcon
        fill="text.caption"
        stroke="text.caption"
        transition="all 0.2s ease-in-out"
        _groupHover={{ fill: "text.primary", stroke: "text.primary" }}
        strokeWidth="0.4"
        {...iconProps}
      />{" "}
      {children}
    </Button>
  );
}

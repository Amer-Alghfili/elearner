import React from "react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTrigger,
} from "../ui/dialog";
import {
  Button,
  Heading,
  Icon,
  IconButton,
  IconButtonProps,
} from "@chakra-ui/react";
import { LuTrash } from "react-icons/lu";

type RemoveButtonProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  withDescription?: boolean;
  content?: React.ReactNode;
  showIcon?: boolean;
};
export default function RemoveButton({
  title = "Are you sure you want to delete ?",
  description = "Are you sure you want to delete ? This action cannot be undone",
  withDescription = true,
  icon = (
    <Icon color="accent.softCoral" w="1.3rem" h="1.3rem">
      <LuTrash />
    </Icon>
  ),
  content,
  showIcon = true,
  children,
  ...rest
}: RemoveButtonProps & { children: React.ReactNode } & Omit<
    IconButtonProps,
    "children" | "content"
  >) {
  return (
    <DialogRoot>
      {showIcon && (
        <DialogTrigger asChild>
          <IconButton
            variant="plain"
            p={0}
            _hover={{ bg: "accent.softCoral.transparent" }}
            {...rest}
          >
            {icon}
          </IconButton>
        </DialogTrigger>
      )}
      {content != null && <DialogTrigger>{content}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <Heading as="h4">{title}</Heading>
        </DialogHeader>
        <DialogBody textStyle="md">
          {withDescription ? description : null}
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogActionTrigger>
          {children}
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

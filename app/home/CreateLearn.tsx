"use client";

import AddButton from "@/components/button/add";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Button, Input } from "@chakra-ui/react";
import React from "react";

export default function CreateLearn() {
  const [open, setOpen] = React.useState<boolean>();

  return (
    <>
      <AddButton
        onClick={() => setOpen(true)}
        textStyle="h3"
        iconProps={{ w: "1.9375rem", h: "1.9375rem" }}
      >
        New Learn
      </AddButton>
      <DialogRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
        <DialogContent
          maxW="none"
          w="80%"
          bg="linear-gradient(127deg, #F4F4F2 0%, rgba(255, 255, 255, 0.7) 64%, rgba(255, 255, 255, 0.4) 100%)"
          backdropFilter="blur(80px)"
        >
          <DialogHeader pb={0} px="3rem">
            <Field>
              <Input
                variant="plain"
                textStyle="h2"
                placeholder="Learn title..."
                _placeholder={{ color: "#7A7A7A" }}
              />
            </Field>
          </DialogHeader>
          <DialogBody px="3rem">
            <Field>
              <Input
                variant="plain"
                textStyle="h4"
                fontWeight="medium"
                placeholder="Add description..."
                _placeholder={{ color: "#7A7A7A" }}
              />
            </Field>
          </DialogBody>
          <DialogFooter px="3rem" pt="3rem" pb="2rem">
            <Button
              w="100%"
              maxW="12.5rem"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button w="100%" maxW="12.5rem">
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
}

"use client";

import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";
import { Button, Textarea } from "@chakra-ui/react";
import React from "react";
import { LuMessageSquare } from "react-icons/lu";
import { sendFeedback } from "@/app/lib/feedback";

export default function FeedbackButton() {
  const [open, setOpen] = React.useState(false);
  const [feedback, setFeedback] = React.useState("");
  const [isPending, setIsPending] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    const result = await sendFeedback(feedback);
    setIsPending(false);

    if (result.error) {
      toaster.create({
        title: result.error,
        type: "error",
        closable: true,
      });
    } else {
      toaster.create({
        title: "Feedback sent, thank you!",
        type: "success",
        closable: true,
      });
      setFeedback("");
      setOpen(false);
    }
  }

  return (
    <>
      <Button
        variant="plain"
        color="primary"
        fontWeight="bold"
        onClick={() => setOpen(true)}
      >
        <LuMessageSquare />
        Feedback
      </Button>
      <DialogRoot open={open} onOpenChange={({ open }) => setOpen(open)}>
        <DialogContent
          maxW="none"
          w="40rem"
          bg="linear-gradient(127deg, #F4F4F2 0%, rgba(255, 255, 255, 0.7) 64%, rgba(255, 255, 255, 0.4) 100%)"
          backdropFilter="blur(80px)"
        >
          <form onSubmit={handleSubmit}>
            <DialogHeader px="3rem">
              <DialogTitle textStyle="h4">Send Feedback</DialogTitle>
            </DialogHeader>
            <DialogBody px="3rem">
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                border="none"
                px={0}
                _focusVisible={{ outline: "none" }}
                resize="none"
                rows={6}
                placeholder="What's on your mind?"
                _placeholder={{ color: "#7A7A7A" }}
              />
            </DialogBody>
            <DialogFooter px="3rem" pt="1rem" pb="2rem">
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button loading={isPending} type="submit">
                Send
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </DialogRoot>
    </>
  );
}

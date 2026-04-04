"use client";

import { DialogBody, DialogContent, DialogRoot } from "@/components/ui/dialog";
import { Button, Flex, Heading, Link, Text } from "@chakra-ui/react";
import React from "react";
import { FaPlay } from "react-icons/fa";

export default function VideoGuide() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Flex
        w="full"
        direction="column"
        gap="0.75em"
        px="2em"
        py="1.75em"
        bg="primary.thin"
        borderRadius="12px"
      >
        <Heading as="h4" fontSize="lg" fontWeight="bold" color="text.primary">
          Not sure how to use Elearner? 🤔
        </Heading>
        <Text fontSize="sm" color="text.secondary">
          Watch this short video to see how to get the most out of Elearner.
        </Text>
        <Button mt="2em" alignSelf="flex-start" onClick={() => setOpen(true)}>
          Watch video <FaPlay />
        </Button>
      </Flex>

      <DialogRoot
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        size="xl"
        placement="center"
      >
        <DialogContent borderRadius="12px">
          <DialogBody p="0">
            <iframe
              width="100%"
              style={{ aspectRatio: "16/9", borderRadius: "12px" }}
              src={
                open
                  ? "https://www.youtube.com/embed/l_8aWs8w1w4?autoplay=1"
                  : undefined
              }
              title="YouTube video"
              allowFullScreen
            />
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </>
  );
}

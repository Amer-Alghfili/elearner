"use client";

import Header from "@/components/Header";
import { Scaffold } from "@/components/Scaffold";
import { Button, Card, Image, Stack, Link } from "@chakra-ui/react";
import LearnsContainer from "./LearnsContainer";
import VideoGuide from "./VideoGuide";

export default function HomePage() {
  const learns: any[] = [];

  const knowledgeItemsCount = 0;

  return (
    <Scaffold>
      <Header />
      <Stack mt="6.4375em" alignItems="flex-start" gap="2em">
        {knowledgeItemsCount > 0 && (
          <Card.Root
            maxH="10rem"
            flexDirection="row"
            w="full"
            border="none"
            borderRadius="12px"
            bg="primary.thick"
            color="neutral.background"
          >
            <Card.Body
              gap="0.5em"
              flexDirection={{ base: "row", md: "column" }}
              justifyContent={{ base: "space-between", md: "flex-start" }}
            >
              <Stack gap="0.5em">
                <Card.Title>Pending knowledge items</Card.Title>
                <Card.Description color="neutral.background">
                  Start reviewing what you have learnt 🔥
                </Card.Description>
              </Stack>
              <Button
                asChild
                alignSelf="flex-start"
                mt={{ base: "0", md: "1em" }}
              >
                <Link href="/review-learns">Review</Link>
              </Button>
            </Card.Body>
            <Image
              src="/stacking-notes.png"
              w="14em"
              h="14em"
              alt="stacking-notes image"
              alignSelf="flex-end"
              display={{ base: "none", md: "block" }}
            />
          </Card.Root>
        )}
        <VideoGuide />
        <LearnsContainer
          learns={learns.map((learn) => ({
            ...learn,
            lastNoteFileId: learn.noteFiles[learn.noteFiles.length - 1]?.id,
          }))}
        />
      </Stack>
    </Scaffold>
  );
}

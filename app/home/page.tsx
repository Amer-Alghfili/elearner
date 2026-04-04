import Header from "@/components/Header";
import { Scaffold } from "@/components/Scaffold";
import { Button, Card, Image, Stack, Link } from "@chakra-ui/react";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import LearnsContainer from "./LearnsContainer";
import VideoGuide from "./VideoGuide";

export default async function HomePage() {
  const today = new Date();

  const data = await auth();

  const learns = await prisma.learn.findMany({
    where: {
      user_id: data?.user?.email as string,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      noteFiles: {
        select: {
          id: true,
        },
        take: 1,
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  let knowledgeItemsCount = await prisma.flashCard.count({
    where: {
      learn_id: {
        in: learns.map(({ id }) => id),
      },
      due: {
        lte: today,
      },
    },
  });

  if (!knowledgeItemsCount) {
    knowledgeItemsCount = await prisma.practiceTask.count({
      where: {
        learn_id: {
          in: learns.map(({ id }) => id),
        },
        due: {
          lte: today,
        },
      },
    });
  }

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
            <Card.Body gap="0.5em">
              <Card.Title>Pending knowledge items</Card.Title>
              <Card.Description color="neutral.background">
                Start reviewing what you have learnt 🔥
              </Card.Description>
              <Button asChild alignSelf="flex-start" mt="1em">
                <Link href="/review-learns">Review</Link>
              </Button>
            </Card.Body>
            <Image
              src="/stacking-notes.png"
              w="14em"
              h="14em"
              alt="stacking-notes image"
              alignSelf="flex-end"
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

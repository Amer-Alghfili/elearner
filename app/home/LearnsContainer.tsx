"use client";

import React from "react";
import CreateLearn from "./CreateLearn";
import { Learns } from "./Learns";
import { Learn } from "./actions";
import { Heading, Stack, Text } from "@chakra-ui/react";
import { Empty } from "@/components/empty-state/Empty";

export default function LearnsContainer(props: { learns: Learn[] }) {
  const [learns, setLearns] = React.useState<Learn[]>(props.learns);

  React.useEffect(
    function syncLearns() {
      setLearns(props.learns);
    },
    [props.learns]
  );

  if (learns.length === 0) {
    return (
      <Stack w="full" gap={0} alignItems="center">
        <Empty />
        <Stack gap={0} alignItems="center">
          <Heading as="h4" color="text.primary">
            You do not have any learns
          </Heading>
          <Text color="text.secondary">
            Start organizing your learning process by creating your first learn
          </Text>
        </Stack>
        <CreateLearn
          variant="primary"
          color="white"
          mt="2em"
          textStyle="h5"
          iconProps={{
            w: "1.5rem",
            h: "1.5rem",
            fill: "white",
          }}
          _hover={{ bg: "primary.thick" }}
        />
      </Stack>
    );
  }

  return (
    <>
      <CreateLearn />
      <Learns learns={learns} />
    </>
  );
}

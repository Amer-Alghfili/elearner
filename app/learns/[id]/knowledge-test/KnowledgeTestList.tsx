"use client";

import React from "react";

import { v4 } from "uuid";
import AddButton from "@/components/button/add";
import { Empty } from "@/components/empty-state/Empty";
import { Heading, Stack, Text } from "@chakra-ui/react";

type KnowledgeTest = {
  id: string;
  title: string;
  description?: string;
  due?: Date;
  stage?: string;
  answer: string;
  hints?: string;
  isDraft: boolean;
};
export default function KnowledgeTestList(props: {
  knowledgeTests: KnowledgeTest[];
}) {
  const [knowledgeTests, setKnowledgeTests] = React.useState(
    props.knowledgeTests
  );

  function draft() {
    setKnowledgeTests([
      ...knowledgeTests,
      {
        id: v4(),
        title: "",
        description: "",
        answer: "",
        hints: "",
        isDraft: true,
      },
    ]);
  }

  let content;
  if (knowledgeTests.length > 0) {
    content = knowledgeTests.map((knowledgeTest) => {
      return <h1 key={knowledgeTest.id}>{knowledgeTest.id}</h1>;
    });
  } else {
    content = (
      <Stack w="full" gap={0} alignItems="center">
        <Empty />
        <Stack gap={0} alignItems="center">
          <Heading as="h4" color="text.primary">
            Your learn does not have any resource
          </Heading>
          <Text color="text.secondary">
            You can add any resource related to your learn
          </Text>
        </Stack>
        <AddButton
          variant="primary"
          color="white"
          mt="2em"
          textStyle="h5"
          iconProps={{
            w: "1.5rem",
            h: "1.5rem",
            fill: "white",
            _groupHover: {},
          }}
          _hover={{ bg: "primary.thick" }}
          onClick={draft}
        >
          New Knowledge Test
        </AddButton>
      </Stack>
    );
  }

  return content;
}

"use client";

import { Stack } from "@chakra-ui/react";
import { useLearn } from "../learn-context";
import AddButton from "@/components/button/add";
import React from "react";
import { Prisma } from "@/generated/prisma/client";

export default function OverviewTabPage() {
  const ctx = useLearn();

  const [todos, setTodos] = React.useState<
    Omit<Prisma.learns_todosModel, "learn_id">[]
  >(ctx.learn.todos);

  function draftTodo() {
    setTodos([...todos, { id: Math.random(), title: "", description: "" }]);
  }

  return (
    <Stack alignItems="flex-start">
      <AddButton onClick={() => draftTodo()}>New todo</AddButton>
    </Stack>
  );
}

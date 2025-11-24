"use client";

import { Prisma } from "@/generated/prisma/client";
import { Box, Tabs } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";
import { LearnContext } from "./learn-context";

type Tab = "overview" | "resources";

export function LayoutTabs({
  children,
  learn,
}: {
  learn: Prisma.learnsModel & { todos: Prisma.learns_todosModel[] };
  children: React.ReactNode;
}) {
  const [tab, setTab] = React.useState<Tab>("overview");

  const router = useRouter();

  function onTabChange(value: string) {
    setTab(value as Tab);
    router.push(value);
  }

  return (
    <Tabs.Root value={tab} onValueChange={({ value }) => onTabChange(value)}>
      <Tabs.List>
        <Tabs.Trigger value="overview" fontWeight="semibold">
          Overview
        </Tabs.Trigger>
        <Tabs.Trigger value="resources" fontWeight="semibold">
          Resources
        </Tabs.Trigger>
      </Tabs.List>
      <LearnContext.Provider value={{ learn }}>
        <Box mt="2em">{children}</Box>
      </LearnContext.Provider>
    </Tabs.Root>
  );
}

"use client";

import { Box, Tabs } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

type Tab = "overview" | "resources" | "knowledge-test" | "notebook";

export function LayoutTabs({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabByPathname = pathname.split("/").at(-1) as Tab;
  const [tab, setTab] = React.useState<Tab>(tabByPathname);

  React.useEffect(
    function updateTabOnNavigation() {
      setTab(tabByPathname);
    },
    [pathname]
  );

  const router = useRouter();

  function onTabChange(value: string) {
    setTab(value as Tab);
    router.push(value);
  }

  return (
    <Tabs.Root
      value={tab}
      onValueChange={({ value }) => onTabChange(value)}
      display="flex"
      flexDirection="column"
      gap="3em"
    >
      <Tabs.List>
        <Tabs.Trigger value="overview" fontWeight="semibold">
          Overview
        </Tabs.Trigger>
        <Tabs.Trigger value="notebook" fontWeight="semibold">
          Notebook
        </Tabs.Trigger>
        <Tabs.Trigger value="resources" fontWeight="semibold">
          Resources
        </Tabs.Trigger>
        <Tabs.Trigger value="knowledge-test" fontWeight="semibold">
          Knowledge Test
        </Tabs.Trigger>
      </Tabs.List>
      <Box>{children}</Box>
    </Tabs.Root>
  );
}

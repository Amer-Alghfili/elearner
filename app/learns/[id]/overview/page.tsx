"use client";

import { Stack } from "@chakra-ui/react";
import { useLearn } from "../learn-context";
import AddButton from "@/components/button/add";

export default function OverviewTabPage() {
  const { learn } = useLearn();

  return (
    <Stack alignItems="flex-start">
      <AddButton>New todo</AddButton>
    </Stack>
  );
}

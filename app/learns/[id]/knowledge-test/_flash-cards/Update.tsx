import { IconButton } from "@chakra-ui/react";
import React from "react";
import { EditIcon } from "@/components/Icons";
import { Flashcard } from "@/app/learns/[id]/knowledge-test/_flash-cards/types";
import Upsert from "./upsert";

export function Update({ flashCard }: { flashCard: Flashcard }) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        variant="plain"
        p={0}
        minW="2rem"
        h="2rem"
        _hover={{ bg: "primary.transparent" }}
      >
        <EditIcon w="1.2rem" h="1.2rem" />
      </IconButton>
      <Upsert
        key={open.toString()}
        open={open}
        setOpen={setOpen}
        defaultValues={flashCard}
      />
    </>
  );
}

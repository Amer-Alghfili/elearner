import React from "react";
import { useRouter, usePathname } from "next/navigation";
import RemoveButton from "@/components/button/remove";
import { Button, Icon } from "@chakra-ui/react";
import { LuTrash } from "react-icons/lu";
import { useLearnNotebooksContext } from "../LearnPageContainer";

export function RemoveNotebook({
  id,
  learnId,
}: {
  id: number;
  learnId: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { notebooks, removeNotebook } = useLearnNotebooksContext();

  async function handleDelete() {
    const isActive = pathname.endsWith(`/${id}`);

    await removeNotebook(id);

    if (isActive) {
      const remaining = notebooks.filter((n) => n.id !== id);
      if (remaining.length > 0) {
        router.push(
          `/learns/${learnId}/${remaining[remaining.length - 1].id}` as any,
        );
      } else {
        router.replace(`/learns/${learnId}` as any);
      }
    }
  }

  return (
    <RemoveButton
      className="group"
      _hover={{ bg: "stroke" }}
      h="auto"
      icon={
        <Icon color="accent.softCoral" w="1rem" h="1rem">
          <LuTrash />
        </Icon>
      }
    >
      <form onClick={(e) => e.stopPropagation()} action={handleDelete}>
        <Button type="submit" bg="feedback.error">
          Delete
        </Button>
      </form>
    </RemoveButton>
  );
}

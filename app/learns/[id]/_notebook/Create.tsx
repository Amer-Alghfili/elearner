import { PlusIcon } from "@/components/Icons";
import { useRouter } from "next/navigation";
import { IconButton } from "@chakra-ui/react";
import { useLearnNotebooksContext } from "../LearnPageContainer";

export function CreateNotebook({ learnId }: { learnId: number }) {
  const router = useRouter();
  const { createNotebook } = useLearnNotebooksContext();

  async function handleCreate() {
    const newId = await createNotebook(learnId);
    if (newId != null) {
      router.push(`/learns/${learnId}/${newId}` as any);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleCreate();
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <IconButton
        type="submit"
        variant="plain"
        size="sm"
        _hover={{ bg: "stroke" }}
        p={0}
        textStyle="sm-semibold"
      >
        <PlusIcon
          fill="text.secondary"
          stroke="text.secondary"
          strokeWidth="0.5"
        />
      </IconButton>
    </form>
  );
}

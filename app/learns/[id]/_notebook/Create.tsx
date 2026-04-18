import { PlusIcon } from "@/components/Icons";
import { useRouter } from "next/navigation";
import { Box, IconButton } from "@chakra-ui/react";
import { useLearnNotebooksContext } from "../LearnPageContainer";
import { Tooltip } from "@/components/ui/tooltip";

export function CreateNotebook({
  learnId,
  atNotebookLimit = false,
}: {
  learnId: number;
  atNotebookLimit?: boolean;
}) {
  const router = useRouter();
  const { createNotebook } = useLearnNotebooksContext();

  async function handleCreate() {
    const newId = await createNotebook(learnId);
    if (newId != null) {
      router.push(`/learns/${learnId}/${newId}` as any);
    }
  }

  return (
    <Tooltip
      content="You've reached the free plan limit"
      disabled={!atNotebookLimit}
    >
      <Box
        as="span"
        display="inline-block"
        cursor={atNotebookLimit ? "not-allowed" : "default"}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
        >
          <IconButton
            type="submit"
            variant="plain"
            size="sm"
            _hover={{ bg: atNotebookLimit ? "transparent" : "stroke" }}
            p={0}
            textStyle="sm-semibold"
            disabled={atNotebookLimit}
            pointerEvents={atNotebookLimit ? "none" : "auto"}
          >
            <PlusIcon
              fill="text.secondary"
              stroke="text.secondary"
              strokeWidth="0.5"
            />
          </IconButton>
        </form>
      </Box>
    </Tooltip>
  );
}

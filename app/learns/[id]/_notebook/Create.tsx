import { PlusIcon } from "@/components/Icons";
import { useForm } from "react-hook-form";
import { NotebookType } from "../[notebookId]";
import { createNotebook } from "./action";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { IconButton } from "@chakra-ui/react";
import React from "react";

export function CreateNotebook({ learnId }: { learnId: number }) {
  const [recentlyCreatedNotebookId, setRecentlyCreatedNotebookId] =
    React.useState<number | null>(null);

  const router = useRouter();

  const methods = useForm<NotebookType>({
    defaultValues: { learnId, title: "untitled" },
  });

  async function submit(notebook: NotebookType) {
    const { error, data } = await createNotebook(notebook);

    if (error) {
      toaster.create({
        title: error,
        type: "error",
        closable: true,
      });
    } else {
      router.refresh();

      setRecentlyCreatedNotebookId(data!.id);
    }
  }

  React.useEffect(
    function redirectToCreatedNotebook() {
      if (recentlyCreatedNotebookId == null) return;

      router.push(`/learns/${learnId}/${recentlyCreatedNotebookId}` as any);
    },
    [recentlyCreatedNotebookId]
  );

  return (
    <form
      onSubmit={methods.handleSubmit(submit)}
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

import { PlusIcon } from "@/components/Icons";
import { useForm } from "react-hook-form";
import { NotebookType } from "../[notebookId]";
import { createFile } from "./action";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import { Button } from "@chakra-ui/react";

export function CreateNotebook({ learnId }: { learnId: number }) {
  const router = useRouter();

  const methods = useForm<NotebookType>({
    defaultValues: { learnId, title: "untitled" },
  });

  async function submit(notebook: NotebookType) {
    const { error } = await createFile(notebook);

    if (error) {
      toaster.create({
        title: error,
        type: "error",
        closable: true,
      });
    } else {
      router.refresh();
    }
  }

  return (
    <form
      onSubmit={methods.handleSubmit(submit)}
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        type="submit"
        variant="plain"
        size="sm"
        p={0}
        h="auto"
        textStyle="sm-semibold"
      >
        <PlusIcon
          fill="text.secondary"
          stroke="text.secondary"
          strokeWidth="0.5"
        />
        New
      </Button>
    </form>
  );
}

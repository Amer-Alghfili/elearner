"use client";

import React from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  createNotebook as createNotebookAction,
  deleteNotebook as deleteNotebookAction,
} from "./_notebook/action";
import { updateFileTitle, updateFileBlocks } from "./[notebookId]/actions";
import { toaster } from "@/components/ui/toaster";

export type NotebookSummary = {
  id: number;
  title: string;
};

export function useLearnNotebooks(initialNotebooks: NotebookSummary[]) {
  const [notebooks, setNotebooks] =
    React.useState<NotebookSummary[]>(initialNotebooks);
  const [optimistic, setOptimistic] =
    React.useOptimistic<NotebookSummary[]>(notebooks);

  async function createNotebook(learnId: number): Promise<number | null> {
    const tempNotebook: NotebookSummary = {
      id: -Date.now(),
      title: "untitled",
    };

    return new Promise((resolve) => {
      React.startTransition(async () => {
        setOptimistic([...notebooks, tempNotebook]);

        try {
          const { error, data } = await createNotebookAction({
            title: "untitled",
            learnId,
          });

          if (error || !data) {
            toaster.create({
              title: error || "Failed to create notebook",
              type: "error",
              closable: true,
            });
            resolve(null);
            return;
          }

          setNotebooks((prev) => [...prev, { id: data.id, title: data.title }]);
          resolve(data.id);
        } catch {
          toaster.create({
            title: "Failed to create notebook",
            type: "error",
            closable: true,
          });
          resolve(null);
        }
      });
    });
  }

  async function removeNotebook(id: number): Promise<void> {
    React.startTransition(async () => {
      setOptimistic(optimistic.filter((n) => n.id !== id));

      const formData = new FormData();
      formData.set("id", id.toString());

      try {
        const result = await deleteNotebookAction({}, formData);

        if (!result.data) {
          toaster.create({
            title: result.error || "Failed to delete notebook",
            type: "error",
            closable: true,
          });
          return;
        }

        setNotebooks((prev) => prev.filter((n) => n.id !== id));
      } catch {
        toaster.create({
          title: "Failed to delete notebook",
          type: "error",
          closable: true,
        });
      }
    });
  }

  const debouncedTitleSync = useDebouncedCallback(
    async (id: number, title: string) => {
      try {
        await updateFileTitle(id, title);
        // Update context state only after successful server sync —
        // avoids re-rendering the sidebar on every keystroke.
        setNotebooks((prev) =>
          prev.map((n) => (n.id === id ? { ...n, title } : n)),
        );
      } catch {
        toaster.create({
          title: "Failed to update title",
          type: "error",
          closable: true,
        });
      }
    },
    300,
  );

  function updateNotebookTitle(id: number, title: string) {
    debouncedTitleSync(id, title);
  }

  function updateNotebookContent(
    id: number,
    blocks: {
      id: string;
      type: string;
      data: any;
      file_id: number;
      order: number;
    }[],
  ) {
    updateFileBlocks(id, blocks);
  }

  return {
    notebooks: optimistic,
    createNotebook,
    removeNotebook,
    updateNotebookTitle,
    updateNotebookContent,
  };
}

export type LearnNotebooksAPI = ReturnType<typeof useLearnNotebooks>;

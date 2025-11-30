import React from "react";

import { Prisma } from "@/generated/prisma/client";

export type Tag = {
  id?: number;
  label: string;
  color: string;
  selected: boolean;
};

export type LearnCtx = {
  id: number;
  resources: (Omit<Prisma.ResourceModel, "id" | "tags" | "learn_id"> & {
    id: string;
    tags: Tag[];
    confirmed?: boolean;
  })[];
  allTags: Omit<Tag, "selected">[];
};

export type ResourceType = LearnCtx["resources"]["0"];

export const LearnContext = React.createContext<LearnCtx>({} as LearnCtx);

export function useLearn(): LearnCtx {
  return React.useContext(LearnContext);
}

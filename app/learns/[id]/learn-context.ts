import React from "react";

import { Prisma } from "@/generated/prisma/client";

type LearnCtx = Prisma.LearnModel & { resources?: Prisma.ResourceModel[] } & {
  todos?: Prisma.TodoModel[];
} & { resourceTags: Prisma.ResourceTagModel[] };

export const LearnContext = React.createContext<LearnCtx>({} as LearnCtx);

export function useLearn(): LearnCtx {
  return React.useContext(LearnContext);
}

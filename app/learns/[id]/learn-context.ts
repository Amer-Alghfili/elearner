import React from "react";

import { Prisma } from "@/generated/prisma/client";

type LearnCtx = {
  learn: Prisma.learnsModel & {
    todos: Omit<Prisma.learns_todosModel, "learn_id">[];
  };
};

export const LearnContext = React.createContext<LearnCtx>({} as LearnCtx);

export function useLearn(): LearnCtx {
  return React.useContext(LearnContext);
}

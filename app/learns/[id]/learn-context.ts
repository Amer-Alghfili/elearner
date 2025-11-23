import React from "react";

import { Prisma } from "@/generated/prisma/client";

export const LearnContext = React.createContext<{ learn: Prisma.learnsModel }>(
  {} as { learn: Prisma.learnsModel }
);

export function useLearn(): { learn: Prisma.learnsModel } {
  return React.useContext(LearnContext);
}

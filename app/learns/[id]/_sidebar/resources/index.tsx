export type Resource = {
  id: number;
  title: string;
  icon: string | null;
  favicon: string | null;
  content: string | Resource[];
};

import React from "react";

export function Resources({ resources }: { resources: Resource[] }) {
  return <div>index</div>;
}

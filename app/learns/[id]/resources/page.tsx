import { prisma } from "@/prisma";
import ResourceList from "./ResourceList";

export default async function ResourcesTabPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const resources = await prisma.resource.findMany({
    where: {
      learn_id: Number(id),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const tagOptions = await prisma.resourceTag.findMany({
    where: {
      learn_id: Number(id),
    },
  });

  return (
    <ResourceList
      learnId={Number(id)}
      resources={resources.map((resource) => ({
        ...resource,
        id: resource.id.toString(),
        isDraft: false,
        tags: resource.tags as [],
      }))}
      tagOptions={tagOptions}
    />
  );
}

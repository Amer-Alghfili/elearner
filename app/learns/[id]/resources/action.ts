"use server";

import { ResourceType, Tag } from "./page";
import { prisma } from "@/prisma";

export async function postResource(resource: ResourceType) {
  const { title, description, learn_id, tags } = resource;

  await prisma.resourceTag.createMany({
    data: tags.map((tag) => ({ label: tag.label, color: tag.color, learn_id })),
  });
}

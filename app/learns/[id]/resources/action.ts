"use server";

import { Prisma } from "@/generated/prisma/client";
import { ResourceType, Tag } from "./page";
import { prisma } from "@/prisma";
import z from "zod";

//TODO: delete resource

export async function postResource(
  resource: ResourceType
): Promise<Omit<Prisma.ResourceModel, "tags"> & { tags: Tag[] }> {
  const { id, title, link, learn_id, tags } = resource;

  // TODO: Validation (valid link, valid title)
  const parsedResource = z
    .object({
      title: z.string("Invalid title"),
      link: z.url("Invalid url"),
    })
    .safeParse(resource);

  if (parsedResource.success) {
    // update resource_tags
    const learnTags = await prisma.resourceTag.findMany({
      where: {
        learn_id,
      },
    });

    const updatedTags = [...tags];
    const existedTags: number[] = [];
    for (const tag of learnTags) {
      const index = updatedTags.findIndex((t) => t.label === tag.label);

      if (index > -1) {
        updatedTags.splice(index, 1);
        existedTags.push(tag.id);
      }
    }

    const createdTags = await prisma.resourceTag.createManyAndReturn({
      data: updatedTags.map(({ label, color }) => ({
        label,
        color,
        learn_id,
      })),
    });

    const upsertTags = [...existedTags, ...createdTags.map((tag) => tag.id)];
    const x = await prisma.resource.upsert({
      where: {
        id: isNaN(Number(id)) ? -1 : Number(id),
        learn_id,
      },
      update: {
        title,
        link,
        tags: upsertTags,
      },
      create: {
        title,
        link,
        tags: upsertTags,
        learn_id,
      },
    });

    return {
      ...x,
      tags: upsertTags.map((id) => createdTags.find((t) => t.id === id) as Tag),
    };
  }

  throw new Error(
    parsedResource.error.issues.map((issue) => issue.message).join("\n")
  );
}

"use server";

import { prisma } from "@/prisma";
import z from "zod";
import { ResourceType, Tag } from "../learn-context";

//TODO: delete resource

export async function postResource(
  learnId: number,
  resource: ResourceType
): Promise<string> {
  const { id, title, link, tags } = resource;

  const parsedResource = z
    .object({
      title: z.string("Invalid title").min(1, "title is required"),
      link: z.url("Invalid url").min(1, "url is required"),
    })
    .safeParse(resource);

  if (parsedResource.success) {
    for (const tag of tags) {
      const { id, label, color } = tag;

      if (id == null) {
        await prisma.resourceTag.create({
          data: {
            label,
            color,
            learn_id: learnId,
          },
        });
      } else {
        await prisma.resourceTag.update({
          where: {
            id,
          },
          data: {
            label,
            color,
          },
        });
      }
    }

    const selectedTags: Tag[] = tags
      .filter(({ selected }) => selected)
      .map((tag) => ({ label: tag.label, color: tag.color, id: tag.id }));

    let resourceId: string;
    if (isNaN(Number(id))) {
      const res = await prisma.resource.create({
        data: {
          title,
          link,
          tags: selectedTags,
          learn_id: learnId,
        },
      });

      resourceId = res.id.toString();
    } else {
      const res = await prisma.resource.update({
        where: {
          id: Number(id),
        },
        data: {
          title,
          link,
          tags: selectedTags,
        },
      });

      resourceId = res.id.toString();
    }

    return resourceId;
  } else if (parsedResource.error) {
    throw new Error(
      parsedResource.error.issues.map((issue) => issue.message).join("\n")
    );
  }

  throw new Error();
}

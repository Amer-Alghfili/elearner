"use server";

import { prisma } from "@/prisma";
import z from "zod";
import { Resource } from "./ResourceList";
import { ZodError } from "@/types/error";

//TODO: create tag

export async function deleteResource(learnId: number, id: number) {
  try {
    await prisma.resource.delete({
      where: {
        id,
      },
    });

    return (await fetchResources(learnId)) as Resource[];
  } catch (err) {
    throw err;
  }
}

export async function postResource(
  learnId: number,
  resource: Resource,
  isNew: boolean
): Promise<Resource[] | ZodError> {
  const { id, title, link } = resource;

  try {
    const parsedResource = z
      .object({
        title: z.string("Invalid title").min(1, "title is required"),
        link: z.url("Invalid url").min(1, "url is required"),
      })
      .safeParse(resource);

    if (parsedResource.success) {
      if (isNew) {
        await prisma.resource.create({
          data: {
            title,
            link,
            learn_id: learnId,
          },
        });
      } else {
        await prisma.resource.update({
          where: {
            id: Number(id),
          },
          data: {
            title,
            link,
          },
        });
      }

      return (await fetchResources(learnId)) as Resource[];
    }

    return {
      errorMessage: parsedResource.error.issues
        .map((issue) => issue.message)
        .join(", "),
    };
  } catch (err) {
    throw err;
  }
}

async function fetchResources(learnId: number): Promise<Resource[]> {
  const result = await prisma.resource.findMany({
    where: {
      learn_id: learnId,
    },
  });

  return result.map((resource) => ({
    ...resource,
    id: resource.id.toString(),
    isDraft: false,
  })) as Resource[];
}

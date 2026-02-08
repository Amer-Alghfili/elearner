"use server";

import { prisma } from "@/prisma";
import { State } from "@/types/server-state";
import * as cheerio from "cheerio";
import z from "zod";
import { Resource } from "@/generated/prisma/client";

async function searchForIconLink(
  html: cheerio.CheerioAPI,
  url: string
): Promise<string | null> {
  let icon = html('link[rel="icon"]').attr("href") || null;
  if (icon) {
    return icon.startsWith("http") ? icon : `${url}/${icon}`;
  }

  icon = html('link[rel="shortcut icon"]').attr("href") || null;
  if (icon) {
    return icon.startsWith("http") ? icon : `${url}/${icon}`;
  }

  icon = html('link[rel="apple-touch-icon"]').attr("href") || null;
  if (icon) {
    return icon.startsWith("http") ? icon : `${url}/${icon}`;
  }

  const faviconUrl = `${url}/favicon.ico`;
  const res = await fetch(faviconUrl);

  if (res.headers.get("Content-Type")?.startsWith("image")) return faviconUrl;

  return null;
}
export async function getWebsiteMetadata(url: string): Promise<{
  title: string;
  iconLink: string | null;
}> {
  const res = await (await fetch(url)).text();

  const html = cheerio.load(res);

  const title = html("title").text();
  const iconLink = await searchForIconLink(html, url);

  return {
    title,
    iconLink,
  };
}

export async function createResource(
  _: unknown,
  formData: FormData
): Promise<State<{ url: string; title: string; icon: string | null }>> {
  const url = formData.get("link") as string;

  const { title, iconLink } = await getWebsiteMetadata(url);

  const validate = z
    .object({
      url: z.url("Invalid url").trim(),
      title: z.string("Invalid title").trim(),
      icon: z.url("Invalid icon url").trim().nullable(),
      parentResource: z.string("Invalid parent resource").trim().nullable(),
    })
    .safeParse({
      url,
      title,
      icon: iconLink,
      parentResource: formData.get("parentResource"),
    });

  if (validate.success) {
    const { parentResource } = validate.data;

    const res = await prisma.resource.create({
      data: {
        title: validate.data.title,
        link: validate.data.url,
        icon: validate.data.icon,
        learn_id: Number(formData.get("learnId") as string),
        parentResource: parentResource == null ? null : Number(parentResource),
      },
    });

    return {
      data: {
        title: res.title,
        url: res.link as string,
        icon: validate.data.icon,
      },
    };
  }

  return {
    error: validate.error.issues.map((i) => i.message).join("\n"),
  };
}

export async function createFolder(
  learnId: number,
  parentResource: number | null
): Promise<{ id: number }> {
  const res = await prisma.resource.create({
    data: {
      title: "untitled",
      icon: null,
      learn_id: learnId,
      parentResource,
    },
  });

  return { id: res.id };
}

export async function renameFolder(formData: FormData): Promise<void> {
  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;

    const validate = z
      .object({
        id: z.string("Invalid id").trim(),
        title: z.string("Invalid title").trim(),
      })
      .safeParse({ id, title });

    if (validate.success) {
      await prisma.resource.update({
        where: { id: Number(validate.data.id) },
        data: { title: validate.data.title },
      });
    } else {
      throw new Error(validate.error.issues.map((i) => i.message).join("\n"));
    }
  } catch {
    throw new Error("Something went wrong");
  }
}

export async function removeResource(
  _: unknown,
  formData: FormData
): Promise<void> {
  try {
    const id = formData.get("id") as string;

    const validate = z
      .object({
        id: z.string("Invalid id").trim(),
      })
      .safeParse({ id });

    if (validate.success) {
      const toDelete: Resource[] = [
        (await prisma.resource.findFirst({
          where: { id: Number(id) },
        })) as Resource,
      ];

      const nestedResources = await prisma.resource.findMany({
        where: {
          parentResource: Number(id),
        },
      });

      toDelete.push(...nestedResources);

      async function findNestedResources(resources: Resource[]) {
        for (const resource of resources) {
          const result = await prisma.resource.findMany({
            where: {
              parentResource: resource.id,
            },
          });

          if (result.length) {
            toDelete.push(...result);
            await findNestedResources(result);
          }
        }
      }

      await findNestedResources(nestedResources);

      await prisma.resource.deleteMany({
        where: {
          id: {
            in: toDelete.map(({ id }) => id),
          },
        },
      });
    } else {
      throw new Error(validate.error.issues.map((i) => i.message).join("\n"));
    }
  } catch {
    throw new Error("Something went wrong");
  }
}

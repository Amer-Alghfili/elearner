"use server";

import { prisma } from "@/prisma";
import { State } from "@/types/server-state";
import * as cheerio from "cheerio";
import z from "zod";
import { Resource } from "@/generated/prisma/client";
import { v4 } from "uuid";

function encodeUrl(url: string) {
  let encoded = url.replace("https://", "https%253A%252F%252F");
  if (encoded === url) {
    encoded = url.replace("http://", "http%253A%252F%252F");

    if (encoded === url) throw Error("Invalid URL");
  }

  return encoded
    .replaceAll("/", "%252F")
    .replaceAll("?", "%3F")
    .replaceAll("&", "%26");
}

async function searchForIconLink(
  html: cheerio.CheerioAPI,
  url: string
): Promise<string | null> {
  const { protocol, host } = new URL(url);
  const prefix = `${protocol}//${host}`;

  let icon = html('link[rel="icon"]').attr("href") || null;
  if (icon) {
    return icon.startsWith("http") || icon.startsWith("www")
      ? icon
      : `${prefix}${icon.startsWith("/") ? icon : "/" + icon}`;
  }

  icon = html('link[rel="shortcut icon"]').attr("href") || null;
  if (icon) {
    return icon.startsWith("http") || icon.startsWith("www")
      ? icon
      : `${prefix}/${icon.startsWith("/") ? icon : "/" + icon}`;
  }

  icon = html('link[rel="apple-touch-icon"]').attr("href") || null;
  if (icon) {
    return icon.startsWith("http") || icon.startsWith("www")
      ? icon
      : `${prefix}/${icon.startsWith("/") ? icon : "/" + icon}`;
  }

  const faviconUrl = `${prefix}/favicon.ico`;
  const res = await fetch(faviconUrl);

  if (res.headers.get("Content-Type")?.startsWith("image")) return faviconUrl;

  return null;
}
async function getWebsiteMetadata(url: string): Promise<{
  title: string;
  iconLink: string | null;
}> {
  const encoded = encodeUrl(url);

  const res = await (
    await fetch(`http://localhost:8000/get-content/${encoded}`)
  ).json();

  const html = cheerio.load(res.content);

  const title = html("title").text();
  const iconLink = await searchForIconLink(html, url);

  const downloadedIconLink = await (
    await fetch(
      `http://localhost:8000/download-favicon/${v4()}/${encodeUrl(
        iconLink as string
      )}`
    )
  ).json();

  return {
    title,
    iconLink: `http://localhost:8000${downloadedIconLink.path}`,
  };
}

export async function createResource(
  _: unknown,
  formData: FormData
): Promise<State<Resource>> {
  const url = formData.get("link") as string;

  // const { title, iconLink } = await getWebsiteMetadata(url);

  const validate = z
    .object({
      url: z.url("Invalid url").trim(),
      title: z.string("Invalid title").trim(),
      icon: z.url("Invalid icon url").trim().nullable(),
      parentResource: z.string("Invalid parent resource").trim().nullable(),
    })
    .safeParse({
      url,
      title: url,
      // icon: iconLink,
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
        favicon: validate.data.icon,
      },
    });

    return {
      data: res,
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

export async function rename(formData: FormData): Promise<void> {
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

export async function updateIcon(
  id: string,
  icon: string | null
): Promise<void> {
  try {
    await prisma.resource.update({
      where: { id: Number(id) },
      data: { icon },
    });
  } catch {
    throw new Error("Something went wrong");
  }
}

export async function deleteResource(formData: FormData): Promise<void> {
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

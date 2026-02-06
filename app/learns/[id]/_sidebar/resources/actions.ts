"use server";

import { prisma } from "@/prisma";
import { State } from "@/types/server-state";
import * as cheerio from "cheerio";
import { url } from "inspector";
import z from "zod";

async function searchForIconLink(
  html: cheerio.CheerioAPI,
  url: string
): Promise<string | null> {
  let icon = html('link[rel="icon"]').attr("href") || null;
  if (icon) {
    return icon;
  }

  icon = html('link[rel="shortcut icon"]').attr("href") || null;
  if (icon) {
    return icon;
  }

  icon = html('link[rel="apple-touch-icon"]').attr("href") || null;
  if (icon) {
    return icon;
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
    })
    .safeParse({ url, title, icon: iconLink });

  if (validate.success) {
    const res = await prisma.resource.create({
      data: {
        title: validate.data.title,
        link: validate.data.url,
        icon: validate.data.icon,
        learn_id: Number(formData.get("learnId") as string),
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

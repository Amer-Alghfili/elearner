"use server";

import * as cheerio from "cheerio";

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

import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site, url }) => {
  const origin = site ?? url;
  const sitemap = new URL("/sitemap-index.xml", origin).href;
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${sitemap}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};

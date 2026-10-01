// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
const site = process.env.SITE_URL;

export default defineConfig({
  // Set SITE_URL in .env and on the deployment platform before production builds.
  site,
  integrations: site ? [sitemap({ filter: (page) => !page.endsWith("/cv/") })] : [],
});

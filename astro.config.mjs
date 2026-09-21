import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// GitHub Pages project sites are served at /<repo-name>/, and the repo name
// differs for every shop that forks this template. Deriving it from
// GITHUB_REPOSITORY (set automatically in GitHub Actions) means a shop never
// has to edit this file after forking.
const repoFullName = process.env.GITHUB_REPOSITORY; // "owner/repo"
const [owner, repo] = repoFullName ? repoFullName.split('/') : [undefined, undefined];

export default defineConfig({
  integrations: [react()],
  site: owner ? `https://${owner}.github.io/${repo}` : undefined,
  base: repo ? `/${repo}` : '/',
});

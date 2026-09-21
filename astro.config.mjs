import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// GitHub Pages project sites are served at /<repo-name>/, and the repo name
// differs for every shop that forks this template. Deriving it from
// GITHUB_REPOSITORY (set automatically in GitHub Actions) means a shop never
// has to edit this file after forking.
//
// `base` must end with a trailing slash: pages build links via string
// concatenation like `${BASE_URL}tournaments/${slug}/`, and without the
// trailing slash that produces a broken, run-together path (e.g.
// "/my-reponame-tournaments/..." instead of "/my-repo/tournaments/...").
const repoFullName = process.env.GITHUB_REPOSITORY; // "owner/repo"
const [owner, repo] = repoFullName ? repoFullName.split('/') : [undefined, undefined];
// Guard against a malformed GITHUB_REPOSITORY (e.g. missing the "/") leaving
// one of owner/repo undefined, which would otherwise leak a literal
// "undefined" into the site URL or base path.
const hasValidRepo = Boolean(owner && repo);

export default defineConfig({
  integrations: [react()],
  site: hasValidRepo ? `https://${owner}.github.io/${repo}` : undefined,
  base: hasValidRepo ? `/${repo}/` : '/',
});

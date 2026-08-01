// @ts-check
import { defineConfig } from 'astro/config';

/**
 * GitHub Pages deployment configuration.
 *
 * A project page is served from  https://<user>.github.io/<repo>/
 * so `base` must be the repo name. A user/org page (<user>.github.io)
 * is served from the root and `base` must be '/' instead.
 *
 * These two values are the ONLY place the deployment URL is written.
 * Everything else resolves paths through `import.meta.env.BASE_URL`.
 *
 * NOTE: BASE_URL always ends in a trailing slash. Asset paths stored in
 * data files therefore must NOT begin with a slash:
 *     `${import.meta.env.BASE_URL}posters/x.webp`   ✅
 *     `${import.meta.env.BASE_URL}/posters/x.webp`  ❌ (double slash)
 */
const GITHUB_USER = 'murattenes';
const REPO_NAME = 'vivideo-case';

export default defineConfig({
  site: `https://${GITHUB_USER}.github.io`,
  base: `/${REPO_NAME}`,
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});

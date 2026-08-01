/**
 * Path helpers for GitHub Pages sub-path deployment.
 *
 * Astro does NOT rewrite paths inside `public/`. A hardcoded "/posters/x.webp"
 * resolves to https://user.github.io/posters/x.webp and 404s, because the site
 * actually lives at https://user.github.io/<repo>/.
 *
 * Every asset and internal link must therefore go through these helpers, and
 * every path stored in a data file must be RELATIVE (no leading slash).
 *
 * `import.meta.env.BASE_URL` always ends with a trailing slash, so we strip any
 * leading slash from the argument to avoid producing a double slash.
 */

/** Resolve a path inside `public/` — images, posters, downloads. */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${stripLeadingSlash(path)}`;
}

/** Resolve an internal route. Keeps the trailing slash (`trailingSlash: 'always'`). */
export function route(path: string): string {
  const clean = stripLeadingSlash(path);
  if (clean === '') return import.meta.env.BASE_URL;
  return `${import.meta.env.BASE_URL}${clean.endsWith('/') ? clean : `${clean}/`}`;
}

function stripLeadingSlash(path: string): string {
  return path.replace(/^\/+/, '');
}

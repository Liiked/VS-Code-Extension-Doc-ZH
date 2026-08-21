import { readdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, normalize, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const docsDirectory = fileURLToPath(new URL("../docs/", import.meta.url));
const knownDirectories = new Set([
  "advanced-topics",
  "api",
  "extensibility-reference",
  "extension-authoring",
  "extension-capabilities",
  "extension-guides",
  "get-started",
  "language-extensions",
  "preknowledge",
  "references",
  "working-with-extensions",
]);
const legacyPaths = new Map([
  [
    "/working-with-extensions/testing-extensions",
    "/working-with-extensions/testing-extension",
  ],
  ["/extension-guides/icon-theme", "/extension-guides/file-icon-theme"],
  ["/preknowledge/generics-and-modules", "/preknowledge/generics"],
  ["/preknowledge/generics-and-modules.md", "/preknowledge/generics"],
]);
const files = await markdownFiles(docsDirectory);
let rewritten = 0;

for (const file of files) {
  const source = await readFile(file, "utf8");
  const output = source.replace(
    /\]\(([^)\s]+)(\s+"[^"]*")?\)/g,
    (match, href, title = "") => {
      const destination = rewriteHref(href, file);
      if (!destination || destination === href) {
        return match;
      }

      rewritten += 1;
      return `](${destination}${title})`;
    },
  );

  if (output !== source) {
    await writeFile(file, output);
  }
}

console.log(`Rewrote ${rewritten} internal link(s).`);

function rewriteHref(href, sourceFile) {
  if (/^(?:https?:|mailto:|#|\/\/)/i.test(href)) {
    return href;
  }

  const [rawPath, rawFragment = ""] = href.split("#", 2);
  const [path, query = ""] = rawPath.split("?", 2);
  const fragment = new URLSearchParams(query).get("id") ?? rawFragment;
  const suffix = fragment ? `#${fragment}` : "";

  if (path.startsWith("/docs/")) {
    return `https://code.visualstudio.com${path}${suffix}`;
  }

  const normalizedPath =
    legacyPaths.get(path.replace(/\\/g, "/")) ?? path.replace(/\\/g, "/");
  if (normalizedPath === "./index") {
    return `/${suffix}`;
  }

  const isAbsolute = normalizedPath.startsWith("/");
  const routePath = (
    isAbsolute ? normalizedPath.slice(1) : normalizedPath.replace(/^\.\//, "")
  ).replace(/\/README(?:\.md)?$/i, "/");
  const firstSegment = routePath.split("/")[0];
  const rootPath =
    isAbsolute ||
    knownDirectories.has(firstSegment) ||
    normalizedPath.startsWith("docs/");
  const candidate = rootPath
    ? join(docsDirectory, routePath.replace(/^docs\//, ""))
    : normalize(join(dirname(sourceFile), routePath));
  const resolved = resolveMarkdownFile(candidate);

  if (!resolved) {
    return href;
  }

  let route = `/${relative(docsDirectory, resolved).split(sep).join("/")}`
    .replace(/\/index\.md$/i, "/")
    .replace(/\.md$/i, "");

  return `${route}${suffix}`;
}

function resolveMarkdownFile(candidate) {
  const options = [
    candidate,
    `${candidate}.md`,
    join(candidate, "index.md"),
    candidate.replace(/\/README\.md$/i, "/index.md"),
  ];

  return options.find((option) => existsSync(option));
}

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory()
        ? markdownFiles(path)
        : entry.name.endsWith(".md")
          ? [path]
          : [];
    }),
  );

  return paths.flat();
}

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const docsDirectory = fileURLToPath(new URL("../docs/", import.meta.url));
const files = await markdownFiles(docsDirectory);
let converted = 0;

for (const file of files) {
  const source = await readFile(file, "utf8");
  const output = source.replace(
    /^\s*([!?])>\s*(.+)$/gm,
    (_, marker, content) => {
      converted += 1;
      const type = marker === "!" ? "warning" : "info";
      return `::: ${type}\n${content}\n:::`;
    },
  );

  if (output !== source) {
    await writeFile(file, output);
  }
}

console.log(`Converted ${converted} Docsify callout(s).`);

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

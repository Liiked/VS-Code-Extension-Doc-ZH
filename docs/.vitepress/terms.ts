import { readFileSync } from "node:fs";
import { resolve } from "node:path";

interface Term {
  description: string;
  name: string;
  source: string;
}

interface InlineToken {
  children?: InlineToken[];
  content: string;
  type: string;
}

interface MarkdownRenderer {
  core: {
    ruler: {
      after: (
        ruleName: string,
        name: string,
        rule: (state: { tokens: InlineToken[] }) => void,
      ) => void;
    };
  };
}

const terms = readTerms();
const termPattern = new RegExp(
  terms
    .map((term) => escapeRegExp(term.name))
    .sort((left, right) => right.length - left.length)
    .join("|"),
  "g",
);

export function configureTerms(markdown: MarkdownRenderer) {
  markdown.core.ruler.after("inline", "terms", (state) => {
    for (let index = 0; index < state.tokens.length; index++) {
      const token = state.tokens[index];
      if (token.type !== "inline" || !token.children) {
        continue;
      }

      // 标题会被右侧大纲（aside）提取引用，替换会污染侧边子导航，因此只处理正文
      if (state.tokens[index - 1]?.type === "heading_open") {
        continue;
      }

      let insideLink = false;
      for (const child of token.children) {
        if (child.type === "link_open") {
          insideLink = true;
          continue;
        }
        if (child.type === "link_close") {
          insideLink = false;
          continue;
        }
        if (insideLink || child.type !== "text") {
          continue;
        }

        child.content = child.content.replace(termPattern, (name) =>
          renderTerm(name),
        );
        child.type = "html_inline";
      }
    }
  });
}

function readTerms() {
  const source = readFileSync(resolve(__dirname, "../index.md"), "utf8");
  const entries =
    source.match(/^[-*] (?:\[([^\]]+)\]\(([^)]+)\) )?(.+?)：(.+)$/gm) ?? [];
  const mapped = new Map<string, Term>();

  for (const entry of entries) {
    const match = entry.match(
      /^[-*] (?:\[([^\]]+)\]\(([^)]+)\) )?(.+?)：(.+)$/,
    );
    if (!match) {
      continue;
    }

    const [, , sourceUrl = "", names, description] = match;
    for (const name of names.split(/[，,/]\s*/)) {
      const cleanedName = name.trim();
      if (cleanedName) {
        mapped.set(cleanedName, {
          name: cleanedName,
          description,
          source: sourceUrl,
        });
      }
    }
  }

  return [...mapped.values()];
}

function renderTerm(name: string) {
  const term = terms.find((item) => item.name === name);
  if (!term) {
    return name;
  }

  const title = term.source
    ? `<a href="${escapeHtml(term.source)}" target="_blank" rel="noreferrer">${escapeHtml(name)}</a>`
    : escapeHtml(name);

  return `<span class="term-tip">${escapeHtml(name)}<span class="term-tip__content">${title}<span>${escapeHtml(term.description)}</span></span></span>`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

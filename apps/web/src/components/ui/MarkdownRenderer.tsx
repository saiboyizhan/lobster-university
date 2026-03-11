interface MarkdownRendererProps {
  content: string;
}

/**
 * Escape HTML entities in text content to prevent XSS.
 * Only call this on raw text, not on already-processed HTML.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Parse inline markdown: bold, italic, inline code, links, strikethrough, images.
 * Operates on already HTML-escaped text (except for code which we handle specially).
 */
function parseInline(text: string): string {
  // Inline code (must come first to prevent inner parsing)
  text = text.replace(
    /`([^`]+)`/g,
    '<code class="rounded bg-zinc-100 px-1.5 py-0.5 text-sm font-mono text-rose-600 dark:bg-zinc-800 dark:text-rose-400">$1</code>',
  );

  // Images: ![alt](src) — only allow HTTPS and relative paths
  text = text.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (_match, alt: string, src: string) => {
      const trimmed = src.trim();
      if (trimmed.startsWith("https://") || trimmed.startsWith("/") || trimmed.startsWith("./")) {
        return `<img src="${trimmed}" alt="${alt}" class="my-4 max-w-full rounded-lg" loading="lazy" />`;
      }
      return `[image blocked: ${alt}]`;
    },
  );

  // Links: [text](url) — only allow safe protocols
  text = text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_match: string, linkText: string, url: string) => {
      const trimmed = url.trim();
      if (trimmed.startsWith("https://") || trimmed.startsWith("http://") || trimmed.startsWith("/") || trimmed.startsWith("./") || trimmed.startsWith("#")) {
        return `<a href="${trimmed}" class="text-blue-600 underline decoration-blue-300 underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:decoration-blue-700 dark:hover:text-blue-300" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      }
      return `[${linkText}](link blocked)`;
    },
  );

  // Bold + italic: ***text*** or ___text___
  text = text.replace(
    /\*\*\*(.+?)\*\*\*/g,
    "<strong><em>$1</em></strong>",
  );
  text = text.replace(
    /___(.+?)___/g,
    "<strong><em>$1</em></strong>",
  );

  // Bold: **text** or __text__
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");

  // Italic: *text* or _text_ (single, not inside words for underscore)
  text = text.replace(
    /(?<!\w)\*([^*\n]+)\*(?!\w)/g,
    "<em>$1</em>",
  );
  text = text.replace(
    /(?<!\w)_([^_\n]+)_(?!\w)/g,
    "<em>$1</em>",
  );

  // Strikethrough: ~~text~~
  text = text.replace(
    /~~(.+?)~~/g,
    '<del class="text-zinc-400 line-through">$1</del>',
  );

  return text;
}

/**
 * Map a language identifier to a display name for the code block label.
 */
function langLabel(lang: string): string {
  const map: Record<string, string> = {
    js: "JavaScript",
    ts: "TypeScript",
    jsx: "JSX",
    tsx: "TSX",
    py: "Python",
    rb: "Ruby",
    rs: "Rust",
    go: "Go",
    sh: "Shell",
    bash: "Bash",
    zsh: "Zsh",
    json: "JSON",
    yaml: "YAML",
    yml: "YAML",
    toml: "TOML",
    md: "Markdown",
    mdx: "MDX",
    html: "HTML",
    css: "CSS",
    sql: "SQL",
    sol: "Solidity",
    dockerfile: "Dockerfile",
    graphql: "GraphQL",
  };
  return map[lang.toLowerCase()] ?? lang;
}

/**
 * Apply basic keyword-based syntax highlighting to code blocks.
 * Returns HTML with <span> color classes. Operates on already-escaped HTML.
 */
function highlightCode(code: string, lang: string): string {
  const l = lang.toLowerCase();

  // Language-specific keyword sets
  const keywordSets: Record<string, string[]> = {
    js: [
      "const", "let", "var", "function", "return", "if", "else", "for", "while",
      "class", "import", "export", "default", "from", "async", "await", "new",
      "this", "try", "catch", "throw", "typeof", "instanceof", "switch", "case",
      "break", "continue", "yield", "of", "in", "null", "undefined", "true", "false",
    ],
    ts: [
      "const", "let", "var", "function", "return", "if", "else", "for", "while",
      "class", "import", "export", "default", "from", "async", "await", "new",
      "this", "try", "catch", "throw", "typeof", "instanceof", "switch", "case",
      "break", "continue", "yield", "of", "in", "null", "undefined", "true", "false",
      "interface", "type", "enum", "implements", "extends", "abstract", "readonly",
      "private", "public", "protected", "as", "is", "keyof", "infer",
    ],
    py: [
      "def", "class", "return", "if", "elif", "else", "for", "while", "import",
      "from", "as", "try", "except", "raise", "with", "yield", "lambda", "pass",
      "break", "continue", "and", "or", "not", "in", "is", "None", "True", "False",
      "async", "await", "self",
    ],
    go: [
      "func", "return", "if", "else", "for", "range", "switch", "case", "default",
      "package", "import", "type", "struct", "interface", "map", "chan", "go",
      "defer", "select", "var", "const", "nil", "true", "false", "break", "continue",
    ],
    rs: [
      "fn", "let", "mut", "return", "if", "else", "for", "while", "loop", "match",
      "use", "mod", "pub", "struct", "enum", "impl", "trait", "where", "self",
      "super", "crate", "async", "await", "move", "ref", "true", "false", "Some",
      "None", "Ok", "Err",
    ],
    sol: [
      "pragma", "solidity", "contract", "function", "returns", "return", "if", "else",
      "for", "while", "mapping", "address", "uint256", "uint", "int", "bool",
      "string", "bytes", "public", "private", "internal", "external", "view", "pure",
      "payable", "memory", "storage", "calldata", "event", "emit", "modifier",
      "require", "revert", "import", "is", "struct", "enum", "true", "false",
    ],
    sh: [
      "if", "then", "else", "elif", "fi", "for", "do", "done", "while", "case",
      "esac", "function", "return", "exit", "echo", "export", "local", "readonly",
      "set", "unset", "shift", "true", "false",
    ],
    json: [],
    html: [],
    css: [],
    sql: [
      "SELECT", "FROM", "WHERE", "INSERT", "INTO", "VALUES", "UPDATE", "SET",
      "DELETE", "CREATE", "TABLE", "ALTER", "DROP", "INDEX", "JOIN", "LEFT",
      "RIGHT", "INNER", "OUTER", "ON", "AND", "OR", "NOT", "NULL", "AS",
      "ORDER", "BY", "GROUP", "HAVING", "LIMIT", "OFFSET", "DISTINCT", "UNION",
      "PRIMARY", "KEY", "FOREIGN", "REFERENCES", "CASCADE", "DEFAULT", "EXISTS",
      "IN", "LIKE", "BETWEEN", "IS", "COUNT", "SUM", "AVG", "MIN", "MAX",
    ],
  };

  // Resolve aliases
  const langAlias: Record<string, string> = {
    javascript: "js", typescript: "ts", jsx: "js", tsx: "ts",
    python: "py", ruby: "py", rust: "rs", bash: "sh", zsh: "sh",
    solidity: "sol", yml: "yaml",
  };
  const resolved = langAlias[l] ?? l;
  const keywords = keywordSets[resolved];

  if (!keywords || keywords.length === 0) {
    // For languages without keyword sets, just highlight strings and comments
    return highlightGeneric(code);
  }

  // Build a processing pipeline
  let result = code;

  // Step 1: Highlight single-line comments
  if (["js", "ts", "go", "rs", "sol", "py"].includes(resolved)) {
    const commentChar = resolved === "py" ? "#" : "//";
    const escapedChar = escapeHtml(commentChar).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    result = result.replace(
      new RegExp(`(${escapedChar}.*)$`, "gm"),
      '<span class="text-zinc-500 italic">$1</span>',
    );
  }
  if (resolved === "sh") {
    result = result.replace(
      /(#.*)$/gm,
      '<span class="text-zinc-500 italic">$1</span>',
    );
  }

  // Step 2: Highlight strings (double-quoted and single-quoted)
  result = result.replace(
    /(&quot;[^&]*?&quot;)/g,
    '<span class="text-emerald-400">$1</span>',
  );
  result = result.replace(
    /(&#x27;[^&]*?&#x27;|'[^']*?')/g,
    '<span class="text-emerald-400">$1</span>',
  );

  // Step 3: Highlight numbers
  result = result.replace(
    /\b(\d+\.?\d*)\b/g,
    '<span class="text-amber-400">$1</span>',
  );

  // Step 4: Highlight keywords (word boundary match)
  const isCaseSensitive = resolved !== "sql";
  for (const kw of keywords) {
    const flags = isCaseSensitive ? "g" : "gi";
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    result = result.replace(
      new RegExp(`\\b(${escaped})\\b(?![^<]*>)`, flags),
      '<span class="text-purple-400 font-semibold">$1</span>',
    );
  }

  return result;
}

function highlightGeneric(code: string): string {
  let result = code;

  // Highlight strings
  result = result.replace(
    /(&quot;[^&]*?&quot;)/g,
    '<span class="text-emerald-400">$1</span>',
  );

  // Highlight numbers
  result = result.replace(
    /\b(\d+\.?\d*)\b/g,
    '<span class="text-amber-400">$1</span>',
  );

  return result;
}

/**
 * Parse a full markdown string into HTML. Works entirely at build/render time
 * (no client JS needed).
 */
function parseMarkdown(source: string): string {
  const lines = source.split("\n");
  const html: string[] = [];
  let i = 0;

  // Helper: consume a fenced code block starting at line i
  function consumeCodeBlock(): string {
    const openFence = lines[i];
    const lang = openFence.replace(/^```\s*/, "").trim();
    const codeLines: string[] = [];
    i++;
    while (i < lines.length && !lines[i].startsWith("```")) {
      codeLines.push(lines[i]);
      i++;
    }
    if (i < lines.length) i++; // skip closing ```

    const rawCode = escapeHtml(codeLines.join("\n"));
    const highlighted = lang ? highlightCode(rawCode, lang) : rawCode;
    const label = lang
      ? `<div class="flex items-center justify-between border-b border-zinc-700 bg-zinc-800 px-4 py-2 text-xs text-zinc-400"><span>${langLabel(lang)}</span></div>`
      : "";
    return `<div class="my-4 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900">${label}<pre class="overflow-x-auto p-4 text-sm leading-relaxed"><code class="font-mono text-zinc-300">${highlighted}</code></pre></div>`;
  }

  // Helper: consume a blockquote block
  function consumeBlockquote(): string {
    const quoteLines: string[] = [];
    while (i < lines.length && lines[i].startsWith("> ")) {
      quoteLines.push(lines[i].slice(2));
      i++;
    }
    // Also handle continuation lines that start with just ">"
    while (i < lines.length && lines[i] === ">") {
      quoteLines.push("");
      i++;
    }
    const inner = quoteLines.map((l) => parseInline(escapeHtml(l))).join("<br />");
    return `<blockquote class="my-4 border-l-4 border-zinc-300 pl-4 text-zinc-600 italic dark:border-zinc-600 dark:text-zinc-400">${inner}</blockquote>`;
  }

  // Helper: consume an unordered list
  function consumeUnorderedList(): string {
    const items: string[] = [];
    while (i < lines.length && /^[\s]*[-*+]\s/.test(lines[i])) {
      const content = lines[i].replace(/^[\s]*[-*+]\s/, "");
      items.push(
        `<li class="ml-1">${parseInline(escapeHtml(content))}</li>`,
      );
      i++;
    }
    return `<ul class="my-3 list-disc space-y-1 pl-6 text-zinc-700 dark:text-zinc-300">${items.join("")}</ul>`;
  }

  // Helper: consume an ordered list
  function consumeOrderedList(): string {
    const items: string[] = [];
    while (i < lines.length && /^\s*\d+\.\s/.test(lines[i])) {
      const content = lines[i].replace(/^\s*\d+\.\s/, "");
      items.push(
        `<li class="ml-1">${parseInline(escapeHtml(content))}</li>`,
      );
      i++;
    }
    return `<ol class="my-3 list-decimal space-y-1 pl-6 text-zinc-700 dark:text-zinc-300">${items.join("")}</ol>`;
  }

  // Helper: consume a table
  function consumeTable(): string {
    const headerLine = lines[i];
    i++; // skip header
    if (i < lines.length && /^\s*\|?\s*[-:]+/.test(lines[i])) {
      i++; // skip separator
    }
    const rows: string[] = [];
    while (i < lines.length && lines[i].trim().startsWith("|")) {
      rows.push(lines[i]);
      i++;
    }

    const parseCells = (line: string): string[] =>
      line
        .split("|")
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

    const headers = parseCells(headerLine);
    const headerHtml = headers
      .map(
        (h) =>
          `<th class="border border-zinc-200 bg-zinc-50 px-4 py-2 text-left text-sm font-semibold text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">${parseInline(escapeHtml(h))}</th>`,
      )
      .join("");

    const bodyHtml = rows
      .map((row) => {
        const cells = parseCells(row);
        const cellsHtml = cells
          .map(
            (c) =>
              `<td class="border border-zinc-200 px-4 py-2 text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">${parseInline(escapeHtml(c))}</td>`,
          )
          .join("");
        return `<tr>${cellsHtml}</tr>`;
      })
      .join("");

    return `<div class="my-4 overflow-x-auto"><table class="w-full border-collapse rounded-lg"><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
  }

  // Main parsing loop
  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith("```")) {
      html.push(consumeCodeBlock());
      continue;
    }

    // Horizontal rule: ---, ***, ___
    if (/^(\s*[-*_]\s*){3,}$/.test(line)) {
      html.push(
        '<hr class="my-6 border-t border-zinc-200 dark:border-zinc-700" />',
      );
      i++;
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = parseInline(escapeHtml(headingMatch[2]));
      const styles: Record<number, string> = {
        1: "mt-8 mb-4 text-3xl font-bold text-zinc-900 dark:text-white",
        2: "mt-6 mb-3 text-2xl font-bold text-zinc-900 dark:text-white",
        3: "mt-5 mb-2 text-xl font-semibold text-zinc-900 dark:text-white",
        4: "mt-4 mb-2 text-lg font-semibold text-zinc-800 dark:text-zinc-100",
        5: "mt-3 mb-1 text-base font-semibold text-zinc-800 dark:text-zinc-200",
        6: "mt-3 mb-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300",
      };
      html.push(`<h${level} class="${styles[level]}">${text}</h${level}>`);
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ") || line === ">") {
      html.push(consumeBlockquote());
      continue;
    }

    // Table (line starts with | and next line is separator)
    if (
      line.trim().startsWith("|") &&
      i + 1 < lines.length &&
      /^\s*\|?\s*[-:]+/.test(lines[i + 1])
    ) {
      html.push(consumeTable());
      continue;
    }

    // Unordered list
    if (/^[\s]*[-*+]\s/.test(line)) {
      html.push(consumeUnorderedList());
      continue;
    }

    // Ordered list
    if (/^\s*\d+\.\s/.test(line)) {
      html.push(consumeOrderedList());
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraph: collect consecutive non-empty, non-special lines
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("> ") &&
      lines[i] !== ">" &&
      !/^[\s]*[-*+]\s/.test(lines[i]) &&
      !/^\s*\d+\.\s/.test(lines[i]) &&
      !/^(\s*[-*_]\s*){3,}$/.test(lines[i]) &&
      !(lines[i].trim().startsWith("|") && i + 1 < lines.length && /^\s*\|?\s*[-:]+/.test(lines[i + 1]))
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      const text = paraLines
        .map((l) => parseInline(escapeHtml(l)))
        .join(" ");
      html.push(
        `<p class="my-3 leading-7 text-zinc-700 dark:text-zinc-300">${text}</p>`,
      );
    }
  }

  return html.join("\n");
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const html = parseMarkdown(content);

  return (
    <div
      className="max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

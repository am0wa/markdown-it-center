import type MarkdownIt from "markdown-it";

/** Options for {@link markdownItTextCenter}. */
export interface Options {
  /** CSS class appended to the centered `<p>`. When set alongside `style`, both attrs appear. */
  className?: string;
  /**
   * Inline style applied to the centered `<p>`.
   * @default "text-align:center"
   * Pass `""` to suppress the inline style entirely (e.g. when using a utility CSS class only).
   */
  style?: string;
}

const DEFAULT_STYLE = "text-align:center";
const CENTERABLE = new Set(["paragraph_open", "heading_open"]);

const markdownItTextCenter = (md: MarkdownIt, opts?: Options): void => {
  const style = opts?.style !== undefined ? opts.style : DEFAULT_STYLE;
  const className = opts?.className;

  if (!style && !className) return;

  md.core.ruler.push("center_block", (state) => {
    const { tokens } = state;
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (!token || token.type !== "inline") continue;

      // check markers
      const raw = token.content.trim();
      if (!raw.startsWith("->") || !raw.endsWith("<-")) continue;

      // skip empty
      const inner = raw.slice(2, -2).trim();
      if (!inner) continue;

      const open = tokens[i - 1];
      if (!open || !CENTERABLE.has(open.type)) continue;

      token.content = inner; // "->hello<-" → "hello"

      const children = token.children ?? [];
      const first = children[0];
      const last = children[children.length - 1];

      // if first/last is not text skip replacement
      if (first?.type === "text")
        first.content = first.content.replace(/^->\s*/, "");
      if (last?.type === "text")
        last.content = last.content.replace(/\s*<-$/, "");

      if (style) open.attrJoin("style", style);
      if (className) open.attrJoin("class", className);
    }
  });
};

export default markdownItTextCenter;

import type MarkdownIt from "markdown-it";

/** Options for {@link markdownItCenter}. */
export interface Options {
  /** CSS class appended to centered elements. When set alongside `style`, both attrs appear. */
  className?: string;
  /**
   * Inline style applied to centered elements.
   * @default "text-align:center"
   * Pass `""` to suppress the inline style entirely (e.g. when using a utility CSS class only).
   */
  style?: string;
}

const DEFAULT_STYLE = "text-align:center";
const FENCE_MARKER_O = "-->";
const FENCE_MARKER_C = "<--";
const MARKER_O = "->";
const MARKER_C = "<-";
const OPEN_MARKER_PATTERN = new RegExp(`^${MARKER_O}\\s*`);
const CLOSE_MARKER_PATTERN = new RegExp(`\\s*${MARKER_C}$`);
const CENTERABLE = new Set(["paragraph_open", "heading_open"]);

// Structural types covering only the Token fields needed here, avoiding a hard Token import.
type CenterToken = { attrJoin(name: string, value: string): void };
type InlineToken = {
  content: string;
  children: Array<{ type: string; content: string }> | null | undefined;
};

const stripSingleMarker = (
  child: { type: string; content: string } | undefined,
  pattern: RegExp,
) => {
  if (child?.type === "text") {
    child.content = child.content.replace(pattern, "");
  }
};

/**
 * Strips `->` / `<-` center markers from an inline token's content string and its
 * parsed child token tree — the renderer walks children while other core rules may
 * read `token.content` directly, so both must be updated.
 * @returns `true` if markers were found and removed, `false` if the token is unchanged.
 */
const stripMarkers = (token: InlineToken): boolean => {
  const raw = token.content.trim();
  if (!raw.startsWith(MARKER_O) || !raw.endsWith(MARKER_C)) {
    return false;
  }
  const inner = raw.slice(MARKER_O.length, -MARKER_C.length).trim();
  if (!inner) {
    return false;
  }

  token.content = inner;
  const children = token.children ?? [];
  stripSingleMarker(children[0], OPEN_MARKER_PATTERN);
  stripSingleMarker(children[children.length - 1], CLOSE_MARKER_PATTERN);

  return true;
};

const markdownItCenter = (md: MarkdownIt, opts?: Options): void => {
  const style = opts?.style !== undefined ? opts.style : DEFAULT_STYLE;
  const className = opts?.className;

  if (!style && !className) return;

  // Shared helper: applies style/class attrs to a centerable open token.
  const applyAttrs = (t: CenterToken) => {
    if (style) {
      t.attrJoin("style", style);
    }
    if (className) {
      t.attrJoin("class", className);
    }
  };

  md.core.ruler.push("center_fence", (state) => {
    const { tokens } = state;
    const remove = new Set<number>();

    // Single-pass state machine: openIdx tracks the most-recent unmatched "-->".
    // A nested forward-scan would be O(n²) in the worst case; this is O(n).
    let openIdx = -1;
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (t?.type !== "inline") continue;

      const c = t.content.trim();
      if (c === FENCE_MARKER_O) {
        openIdx = i;
      } else if (c === FENCE_MARKER_C && openIdx !== -1) {
        // Each fence marker compiles to [paragraph_open, inline, paragraph_close].
        // Content sits between openIdx+2 (after opening paragraph_close) and
        // i-1 exclusive (before closing paragraph_open).
        for (let k = openIdx + 2; k < i - 1; k++) {
          const tk = tokens[k];
          if (!tk) continue;
          if (CENTERABLE.has(tk.type)) {
            applyAttrs(tk);
          } else if (tk.type === "inline") {
            stripMarkers(tk);
          }
        }
        // Queue all six fence-marker tokens (open + inline + close for each boundary).
        /* ---- opening fence marker paragraph ---- */
        remove.add(openIdx - 1); // paragraph_open
        remove.add(openIdx); // inline "-->"
        remove.add(openIdx + 1); // paragraph_close
        /* ---- closing fence marker paragraph ---- */
        remove.add(i - 1); // paragraph_open
        remove.add(i); // inline "<--"
        remove.add(i + 1); // paragraph_close
        /* ---------------------------------------- */
        openIdx = -1;
      }
    }

    if (remove.size > 0) {
      state.tokens = tokens.filter((_, i) => !remove.has(i));
    }
  });

  md.core.ruler.push("center_block", (state) => {
    const { tokens } = state;
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (!token || token.type !== "inline") continue;

      const open = tokens[i - 1];
      if (!open || !CENTERABLE.has(open.type)) continue;

      if (!stripMarkers(token)) {
        continue;
      }

      applyAttrs(open);
    }
  });
};

export default markdownItCenter;

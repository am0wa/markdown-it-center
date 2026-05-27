# markdown-it-center

[![npm](https://img.shields.io/npm/v/markdown-it-center)](https://www.npmjs.com/package/markdown-it-center)

A [markdown-it](https://github.com/markdown-it/markdown-it) plugin that adds `->`...`<-` syntax for centering text blocks.

## Example

```markdown
->centered text<-
```

Output:

```
<p style="text-align:center">centered text</p>
```

- `->...<-` signals centering at a glance — no `html` mode needed
- preserves all **(bold)**, _(italic)_, links, and inline markup
- does not interfere with `code` blocks, tables or mermaid content with arrows
- fence `-->` … `<--` centers multiple blocks without adding extra wrapper divs
- allows to use custom style aka to apply Tailwind `text-center` className
- safe to compose with [markdown-it-anchor](https://github.com/valeriangalliat/markdown-it-anchor) or [markdown-it-attrs](https://github.com/arve0/markdown-it-attrs)

## Installation

```bash
npm install markdown-it-center
```

Requires `markdown-it ^14` as a peer dependency.

## Syntax

### Inline — single paragraph or heading

Wrap any paragraph or heading content in `->` … `<-`:

```markdown
->Centered paragraph<-

-> Hello <-

->**Bold** and _italic_ together<-

->[A centered link](https://example.com)<-

# ->Centered heading<-

# ->Centered Blockquote paragraph<-
```

Output:

```html
<p style="text-align:center">Centered paragraph</p>
<p style="text-align:center">Hello</p>
<p style="text-align:center">
  <strong>Bold</strong> and <em>italic</em> together
</p>
<p style="text-align:center">
  <a href="https://example.com">A centered link</a>
</p>
<h1 style="text-align:center">Centered heading</h1>
<blockquote>
  <p style="text-align:center">Centered Quote text</p>
</blockquote>
```

Leading and trailing whitespace inside the markers is trimmed.  
Markers with no content (`-><-`) are left as plain text.

### Fence — multiple blocks

Use `-->` and `<--` on their own lines to center a group of blocks:

```markdown
-->

## Centered heading

Some centered paragraph.

<--
```

Output:

```html
<h2 style="text-align:center">Centered heading</h2>
<p style="text-align:center">Some centered paragraph.</p>
```

The `-->` / `<--` marker lines are removed from the output.  
Code blocks and other non-text elements inside the fence are left untouched.

An unclosed `-->` (no matching `<--`) is left as plain text.

> **Note:** It does not interfere with mermaid diagrams, code blocks, tables, blockquotes content or inline arrows
> — only a standalone `-->` line with a matching `<--` is treated as a fence.

## Usage

```ts
import MarkdownIt from "markdown-it";
import markdownItCenter from "markdown-it-center";

const md = new MarkdownIt().use(markdownItCenter);
```

### Options

```ts
interface Options {
  className?: string; // CSS class added to centered elements (default: none)
  style?: string; // inline style value (default: "text-align:center")
}
```

### Custom style

```ts
md.use(markdownItCenter, { style: "text-align:center; color: red" });
```

### Class only (Tailwind / utility CSS)

Pass `style: ""` to suppress the inline style and rely on a class:

```ts
md.use(markdownItCenter, { className: "text-center", style: "" });
// <p class="text-center">…</p>
```

Options apply to both inline and fence syntax.

## vs markdown-it-attrs

[markdown-it-attrs](https://github.com/arve0/markdown-it-attrs) can also add a centering class via `{.text-center}`:

```markdown
Centered paragraph {.text-center}
```

The difference is intent and ergonomics:

- `->...<-` signals centering at a glance — the syntax is self-documenting and wraps the content symmetrically.
- `{.text-center}` is appended after the content and requires knowing the class name; it's better suited for one-off attribute overrides than a recurring pattern.

## License

MIT — [am0wa](https://github.com/am0wa)

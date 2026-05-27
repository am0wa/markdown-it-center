# markdown-it-text-center

[![npm](https://img.shields.io/npm/v/markdown-it-text-center)](https://www.npmjs.com/package/markdown-it-text-center)

A [markdown-it](https://github.com/markdown-it/markdown-it) plugin that adds `->text<-` syntax for centered paragraphs.

```markdown
->Centered paragraph<-
```

```html
<p style="text-align:center">Centered paragraph</p>
```

## Installation

```bash
npm install markdown-it-text-center
```

Requires `markdown-it ^14` as a peer dependency.

## Usage

```ts
import MarkdownIt from "markdown-it";
import markdownItTextCenter from "markdown-it-text-center";

const md = new MarkdownIt().use(markdownItTextCenter);

md.render("->Hello, world!<-");
// <p style="text-align:center">Hello, world!</p>
```

## Syntax

Any paragraph wrapped in `->` … `<-` is rendered centered. Inner markdown is preserved.

```markdown
->Plain centered text<-

->**Bold** and _italic_ together<-

->[A centered link](https://example.com)<-
```

Leading and trailing whitespace inside the markers is trimmed:

```markdown
-> Hello <-
```

```html
<p style="text-align:center">Hello</p>
```

Markers on a line with no content (`-><-`) are left as plain text.

## Options

```ts
interface Options {
  className?: string; // CSS class added to the <p> (default: none)
  style?: string; // inline style value (default: "text-align:center")
}
```

### Custom style

```ts
md.use(markdownItTextCenter, { style: "text-align:center; color: red" });
```

### Class only (Tailwind / utility CSS)

Pass `style: ""` to suppress the inline style and use a class instead:

```ts
md.use(markdownItTextCenter, { className: "text-center", style: "" });
// <p class="text-center">…</p>
```

### Both custom class and style

```ts
md.use(markdownItTextCenter, { className: "hero", style: "text-align:center" });
// <p class="hero" style="text-align:center">…</p>
```

## vs markdown-it-attrs

[markdown-it-attrs](https://github.com/arve0/markdown-it-attrs) can also add a centering class via `{.text-center}`:

```markdown
Centered paragraph {.text-center}
```

The difference is intent and ergonomics:

- `->...<-` signals centering at a glance — the syntax is self-documenting and wraps the content symmetrically.
- `{.text-center}` is appended after the content and requires knowing the class name; it's better suited for one-off attribute overrides than a recurring pattern.

## License

MIT

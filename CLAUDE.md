# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm build          # compile src/ → lib/ (tsc -b src/tsconfig.json)
pnpm build:watch    # tsc in watch mode
pnpm test           # run tests once (vitest run)
pnpm test:watch     # vitest in watch mode
pnpm lint           # eslint with cache
pnpm format         # prettier on all JS/TS files
```

Run a single test file:

```bash
pnpm vitest run tests/text-center-plugin.test.ts
```

`prepublishOnly` runs `pnpm build && pnpm test` automatically; only `lib/` is included in the published package.

## Architecture

This is a single-file markdown-it plugin published as an ESM-first npm package.

**Source**: `src/text-center-plugin.ts` — the entire plugin. `src/index.ts` re-exports the default export as the public API entry point.

**Build output**: `lib/` (gitignored) — tsc compiles `src/tsconfig.json` (extends root tsconfig, adds `composite: true`). The `exports` map in `package.json` points to `lib/`.

**Plugin mechanism**: Registers one core rule (`center_block`) via `md.core.ruler.push`. The rule runs after inline tokenization and looks for `inline` tokens whose trimmed content starts with `->` and ends with `<-`. It strips the markers from both `token.content` and the first/last `text` child tokens, then calls `attrJoin` on the preceding `paragraph_open` token. No renderer override is needed — markdown-it's default renderer serializes `paragraph_open` attrs automatically.

**Options** (`src/text-center-plugin.ts:3-6`):

- `style` — inline style value, defaults to `'text-align:center'`; pass `''` to suppress
- `className` — CSS class appended to the `<p>`; absent by default

Class-only output (e.g. Tailwind): `{ className: 'text-center', style: '' }` — suppresses the inline style entirely.

**Tests**: `tests/text-center-plugin.test.ts` imports built output as `*.js` (e.g. `text-center-plugin.js`). The regex alias `{ find: /^([\w-]+)\.js$/, replacement: src/$1.ts }` in `vitest.config.mjs` redirects any such import to the matching `src/*.ts` file at test time. `tests/tsconfig.json` uses a `paths` entry for the same wildcard resolution during type-checking.

**Pre-commit hook**: `lint-staged` runs eslint on staged files (`.husky/pre-commit`). Commits must follow Conventional Commits (`commitlint.config.js`).

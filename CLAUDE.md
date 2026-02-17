# lit-tip-tap

Lit 3 web component wrapping TipTap 3 rich text editor. Built with Vite 7 + TypeScript 5.9. Configured as a publishable library (ESM).

## Commands

- `pnpm dev` — Start dev server (serves `index.html` demo page)
- `pnpm build` — Clean dist, emit declarations (`tsc`), Vite library build
- `pnpm lint` / `pnpm lint:fix` — ESLint
- `pnpm format` / `pnpm format:check` — Prettier
- `pnpm test` / `pnpm test:run` — Vitest (browser mode, Playwright Chromium)

## Architecture

- `src/index.ts` — Barrel export for the library (`LitTipTap`, `LitTipTapToolbar`).
- `src/lit-tip-tap.ts` — Main `<lit-tip-tap>` custom element. Creates a TipTap Editor in `connectedCallback()`, mounts to a div ref in `firstUpdated()`, destroys in `disconnectedCallback()`. Accepts initial content via `<template>` child or `initialString` property. Setting `extensions` reactively re-initializes the editor, preserving content.
- `src/lit-tip-tap-toolbar.ts` — Toolbar component.
- `src/index.css` — Global styles for the demo page.
- `index.html` — Demo page.
- `vite.config.ts` — Vite library mode config. Externalizes `lit` and `@tiptap/*`.
- `vitest.config.ts` — Separate Vitest config (browser mode, Playwright). Kept separate from `vite.config.ts` to avoid inheriting library externals.
- `tsconfig.build.json` — Extends `tsconfig.json` with declaration emit for the build.
- `tests/` — Vitest browser-mode tests for `<lit-tip-tap>` and `<lit-tip-tap-toolbar>`.

## Code Style

- Uses Lit experimental decorators (`@customElement`, `@property`)
- `useDefineForClassFields: false` in tsconfig (required for Lit decorators)
- Strict TypeScript with `erasableSyntaxOnly`
- ESLint with `eslint-plugin-lit` and `eslint-config-prettier`
- Use pnpm, not npm

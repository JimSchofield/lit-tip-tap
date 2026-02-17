# lit-tip-tap

Add a rich text editor easily with this component.

Lit web component wrapping [TipTap 3](https://tiptap.dev).

## Install

```sh
pnpm add lit-tip-tap lit @tiptap/core @tiptap/pm @tiptap/starter-kit
```

## Example:

[See a working stack blitz here](https://stackblitz.com/edit/vitejs-vite-qky1dozt?file=src%2Fmy-element.ts)

## `<lit-tip-tap>`

### Properties

- `extensions` (`AnyExtension[]`, default `[]`) — TipTap extensions. Falls back to `StarterKit` when empty. Setting this re-initializes the editor, preserving content.
- `initialString` (`string`, default `''`) — HTML string used as initial editor content.
- `tiptap` (`Editor`) — The underlying TipTap `Editor` instance (read-only, available after connect).

### Initial Content

Set content via the `initialString` property, or provide a `<template>` child:

```html
<lit-tip-tap initial-string="Starting content here."></lit-tip-tap>
```

```html
<lit-tip-tap>
  <template>
    <p>Starting content here.</p>
  </template>
</lit-tip-tap>
```

A `<template>` child takes precedence over `initialString`.

### Getters

- `html` — Current content as HTML.
- `json` — Current content as TipTap JSON.
- `value` — Alias for `html`.
- `textContent` — Plain text content.

### Events

- `change` — Fires on every content update.

### Slots

- `toolbar` — Slot for a toolbar component. Slotted elements receive the `tiptap` editor instance automatically.

## `<lit-tip-tap-toolbar>`

A batteries-included toolbar. Slot it into `<lit-tip-tap>` and it auto-wires to the editor.

Buttons: heading select, bold, italic, strikethrough, code, bullet list, numbered list, indent left/right, blockquote, horizontal rule, clear formatting.

All buttons expose a `part` attribute for styling with `::part()`.

## Code example

```html
<script type="module">
  import 'lit-tip-tap/registered';
  import Underline from '@tiptap/extension-underline';

  const editor = document.querySelector('lit-tip-tap');

  // Add an extension reactively
  editor.extensions = [...editor.extensions, Underline];

  // Listen for changes
  editor.addEventListener('change', () => {
    console.log('HTML:', editor.html);
    console.log('HTML (value):', editor.value);
    console.log('JSON:', editor.json);
    console.log('Text:', editor.textContent);
  });

  // Programmatic access to TipTap
  editor.tiptap.commands.focus();
  editor.tiptap.commands.toggleBold();
</script>

<lit-tip-tap initial-string="<p>Hello <strong>world</strong></p>">
  <lit-tip-tap-toolbar slot="toolbar"></lit-tip-tap-toolbar>
</lit-tip-tap>
```

import { describe, it, expect } from 'vitest';
import { LitTipTap } from '../src/lit-tip-tap.js';
import { LitTipTapToolbar } from '../src/lit-tip-tap-toolbar.js';
import '../src/lit-tip-tap.register.js';
import '../src/lit-tip-tap-toolbar.register.js';

async function createEditorWithToolbar(): Promise<{
  editor: LitTipTap;
  toolbar: LitTipTapToolbar;
}> {
  const editor = document.createElement('lit-tip-tap') as LitTipTap;
  const toolbar = document.createElement(
    'lit-tip-tap-toolbar',
  ) as LitTipTapToolbar;
  toolbar.slot = 'toolbar';
  editor.appendChild(toolbar);
  document.body.appendChild(editor);

  await editor.updateComplete;
  await new Promise((r) => setTimeout(r, 50));
  await toolbar.updateComplete;

  return { editor, toolbar };
}

function getToolbarButtons(toolbar: LitTipTapToolbar): HTMLButtonElement[] {
  return Array.from(
    toolbar.shadowRoot!.querySelectorAll<HTMLButtonElement>('button'),
  );
}

function findButton(
  toolbar: LitTipTapToolbar,
  label: string,
): HTMLButtonElement {
  const btn = getToolbarButtons(toolbar).find((b) =>
    b.textContent?.trim().includes(label),
  );
  if (!btn) throw new Error(`Button "${label}" not found`);
  return btn;
}

describe('lit-tip-tap-toolbar', () => {
  it('renders toolbar buttons', async () => {
    const { editor, toolbar } = await createEditorWithToolbar();

    const buttons = getToolbarButtons(toolbar);
    expect(buttons.length).toBeGreaterThan(0);

    const labels = buttons.map((b) => b.textContent?.trim());
    expect(labels).toContain('Bold');
    expect(labels).toContain('Italic');
    expect(labels).toContain('Strikethrough');

    editor.remove();
  });

  it('bold button toggles is-active class', async () => {
    const { editor, toolbar } = await createEditorWithToolbar();

    const boldBtn = findButton(toolbar, 'Bold');
    expect(boldBtn.classList.contains('is-active')).toBe(false);

    // Select all text and apply bold
    editor.tiptap.commands.setContent('<p>Test</p>');
    editor.tiptap.commands.selectAll();
    editor.tiptap.commands.toggleBold();
    await toolbar.updateComplete;

    expect(boldBtn.classList.contains('is-active')).toBe(true);

    editor.remove();
  });

  it('italic button calls toggleItalic', async () => {
    const { editor, toolbar } = await createEditorWithToolbar();

    editor.tiptap.commands.setContent('<p>Test</p>');
    editor.tiptap.commands.selectAll();

    const italicBtn = findButton(toolbar, 'Italic');
    italicBtn.click();
    await new Promise((r) => setTimeout(r, 50));

    expect(editor.html).toContain('<em>');

    editor.remove();
  });

  it('bold button calls toggleBold', async () => {
    const { editor, toolbar } = await createEditorWithToolbar();

    editor.tiptap.commands.setContent('<p>Test</p>');
    editor.tiptap.commands.selectAll();

    const boldBtn = findButton(toolbar, 'Bold');
    boldBtn.click();
    await new Promise((r) => setTimeout(r, 50));

    expect(editor.html).toContain('<strong>');

    editor.remove();
  });

  it('strike button calls toggleStrike', async () => {
    const { editor, toolbar } = await createEditorWithToolbar();

    editor.tiptap.commands.setContent('<p>Test</p>');
    editor.tiptap.commands.selectAll();

    const strikeBtn = findButton(toolbar, 'Strikethrough');
    strikeBtn.click();
    await new Promise((r) => setTimeout(r, 50));

    expect(editor.html).toContain('<s>');

    editor.remove();
  });

  it('code button calls toggleCode', async () => {
    const { editor, toolbar } = await createEditorWithToolbar();

    editor.tiptap.commands.setContent('<p>Test</p>');
    editor.tiptap.commands.selectAll();

    const codeBtn = findButton(toolbar, 'Code');
    codeBtn.click();
    await new Promise((r) => setTimeout(r, 50));

    expect(editor.html).toContain('<code>');

    editor.remove();
  });
});

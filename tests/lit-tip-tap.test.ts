import { describe, it, expect, vi } from 'vitest';
import { LitTipTap } from '../src/lit-tip-tap.js';
import '../src/lit-tip-tap.register.js';

function createElement(attrs?: {
  initialString?: string;
  templateHTML?: string;
}): LitTipTap {
  const el = document.createElement('lit-tip-tap') as LitTipTap;

  if (attrs?.initialString) {
    el.initialString = attrs.initialString;
  }

  if (attrs?.templateHTML) {
    const tpl = document.createElement('template');
    tpl.innerHTML = attrs.templateHTML;
    el.appendChild(tpl);
  }

  document.body.appendChild(el);
  return el;
}

async function waitForUpdate(el: LitTipTap): Promise<void> {
  await el.updateComplete;
}

describe('lit-tip-tap', () => {
  it('renders and creates a TipTap editor', async () => {
    const el = createElement();
    await waitForUpdate(el);

    expect(el.tiptap).toBeDefined();
    expect(el.tiptap.isDestroyed).toBe(false);

    el.remove();
  });

  it('initialString sets editor content', async () => {
    const el = createElement({ initialString: '<p>Hello world</p>' });
    await waitForUpdate(el);

    expect(el.html).toContain('Hello world');

    el.remove();
  });

  it('<template> child HTML used as initial content', async () => {
    const el = createElement({ templateHTML: '<p>From template</p>' });
    await waitForUpdate(el);

    expect(el.html).toContain('From template');

    el.remove();
  });

  it('html getter returns HTML string', async () => {
    const el = createElement({ initialString: '<p>Test</p>' });
    await waitForUpdate(el);

    expect(el.html).toMatch(/<p>Test<\/p>/);

    el.remove();
  });

  it('json getter returns JSON document', async () => {
    const el = createElement({ initialString: '<p>JSON test</p>' });
    await waitForUpdate(el);

    const json = el.json;
    expect(json).toBeDefined();
    expect(json.type).toBe('doc');
    expect(json.content).toBeDefined();

    el.remove();
  });

  it('value getter returns same as html', async () => {
    const el = createElement({ initialString: '<p>Value test</p>' });
    await waitForUpdate(el);

    expect(el.value).toBe(el.html);

    el.remove();
  });

  it('textContent getter returns plain text', async () => {
    const el = createElement({ initialString: '<p>Plain text</p>' });
    await waitForUpdate(el);

    expect(el.textContent).toBe('Plain text');

    el.remove();
  });

  it('fires change event on content update', async () => {
    const el = createElement();
    await waitForUpdate(el);

    const onChange = vi.fn();
    el.addEventListener('change', onChange);

    el.tiptap.commands.setContent('<p>New content</p>');
    await new Promise((r) => setTimeout(r, 50));

    expect(onChange).toHaveBeenCalled();

    el.remove();
  });

  it('setting extensions re-initializes editor preserving content', async () => {
    const el = createElement({ initialString: '<p>Keep me</p>' });
    await waitForUpdate(el);

    const { Extension } = await import('@tiptap/core');
    const StarterKit = (await import('@tiptap/starter-kit')).default;
    const noop = Extension.create({ name: 'noop' });

    const oldEditor = el.tiptap;
    el.extensions = [StarterKit, noop];
    await waitForUpdate(el);

    expect(oldEditor.isDestroyed).toBe(true);
    expect(el.tiptap).not.toBe(oldEditor);
    expect(el.tiptap.isDestroyed).toBe(false);
    expect(el.html).toContain('Keep me');

    const extNames = el.tiptap.extensionManager.extensions.map((e) => e.name);
    expect(extNames).toContain('noop');

    el.remove();
  });

  it('clearing extensions falls back to StarterKit', async () => {
    const el = createElement({ initialString: '<p>Still here</p>' });
    await waitForUpdate(el);

    const StarterKit = (await import('@tiptap/starter-kit')).default;
    const { Extension } = await import('@tiptap/core');
    const noop = Extension.create({ name: 'noop' });

    // Set custom extensions
    el.extensions = [StarterKit, noop];
    await waitForUpdate(el);

    // Clear back to empty (should fall back to StarterKit)
    el.extensions = [];
    await waitForUpdate(el);

    expect(el.tiptap.isDestroyed).toBe(false);
    expect(el.html).toContain('Still here');

    const extNames = el.tiptap.extensionManager.extensions.map((e) => e.name);
    expect(extNames).not.toContain('noop');

    el.remove();
  });

  it('removing an extension re-initializes with remaining', async () => {
    const el = createElement({ initialString: '<p>Content</p>' });
    await waitForUpdate(el);

    const StarterKit = (await import('@tiptap/starter-kit')).default;
    const { Extension } = await import('@tiptap/core');
    const ext1 = Extension.create({ name: 'ext1' });
    const ext2 = Extension.create({ name: 'ext2' });

    el.extensions = [StarterKit, ext1, ext2];
    await waitForUpdate(el);

    // Remove ext1
    el.extensions = [StarterKit, ext2];
    await waitForUpdate(el);

    expect(el.tiptap.isDestroyed).toBe(false);
    expect(el.html).toContain('Content');

    const extNames = el.tiptap.extensionManager.extensions.map((e) => e.name);
    expect(extNames).toContain('ext2');
    expect(extNames).not.toContain('ext1');

    el.remove();
  });

  it('destroys editor on disconnect', async () => {
    const el = createElement();
    await waitForUpdate(el);

    const editor = el.tiptap;
    el.remove();

    expect(editor.isDestroyed).toBe(true);
  });
});

import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { Editor, type AnyExtension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { createRef, ref } from 'lit/directives/ref.js';
import defaultStyles from './basic.styles';

import { Extension } from '@tiptap/core';

export class LitTipTap extends LitElement {
  static override styles = defaultStyles;

  #eventsExtension = Extension.create({
    onUpdate: () => {
      this.dispatchEvent(new Event('change'));
    },
  });

  tiptap!: Editor;

  @property({ attribute: false })
  extensions: AnyExtension[] = [];

  #createEditor(extraExtensions: AnyExtension[]): Editor {
    const extensions = [
      ...(extraExtensions.length > 0 ? extraExtensions : [StarterKit]),
      this.#eventsExtension,
    ];

    return new Editor({ extensions, injectCSS: true });
  }

  addExtension(...newExtensions: AnyExtension[]): void {
    const content = this.tiptap.getJSON();
    const mountEl = this._tipTapEl.value;

    this.tiptap.destroy();
    this.extensions = [...this.extensions, ...newExtensions];
    this.tiptap = this.#createEditor(this.extensions);

    if (mountEl) {
      this.tiptap.mount(mountEl);
      this.tiptap.commands.setContent(content);
    }

    this.#provideEditorToSlots();
  }

  _tipTapEl = createRef<HTMLDivElement>();

  @property()
  initialString = '';

  get initialContents() {
    const maybeContents = this.querySelector('template');

    if (!maybeContents) {
      return this.initialString;
    }

    this.initialString = maybeContents.innerHTML.trim();

    return this.initialString;
  }

  connectedCallback() {
    super.connectedCallback();

    this.tiptap = this.#createEditor(this.extensions);

    this.#provideEditorToSlots();
  }

  #provideEditorToSlots() {
    const els = this.querySelectorAll<Element & { tiptap: Editor }>('[slot]');

    els.forEach((el) => {
      el.tiptap = this.tiptap;
    });
  }

  firstUpdated(): void {
    if (!this._tipTapEl.value) {
      throw new Error('Lit tip tap mounting div not present!');
    }

    this.tiptap.mount(this._tipTapEl.value);
    this.tiptap.commands.setContent(this.initialContents);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.tiptap?.destroy();
  }

  get html() {
    return this.tiptap?.getHTML() ?? '';
  }

  get json() {
    return this.tiptap?.getJSON();
  }

  get value() {
    return this.html;
  }

  override get textContent() {
    return this.tiptap?.getText() ?? '';
  }

  render() {
    return html`<div>
      <slot name="toolbar"></slot>
      <div ${ref(this._tipTapEl)}></div>
    </div>`;
  }
}

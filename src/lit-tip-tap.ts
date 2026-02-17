import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Editor, type AnyExtension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { createRef, ref } from 'lit/directives/ref.js';

import { Extension } from '@tiptap/core';

@customElement('lit-tip-tap')
export class LitTipTap extends LitElement {
  static override styles = css`
    code {
      background-color: rgba(0, 0, 0, 0.05);
      border-radius: 0.25em;
      padding: 0.15em 0.3em;
      font-size: 0.9em;
    }

    pre code {
      display: block;
      background-color: rgba(0, 0, 0, 0.05);
      border-radius: 0.375em;
      padding: 0.75em 1em;
      font-size: 0.9em;
    }

    blockquote {
      border-left: 3px solid rgba(0, 0, 0, 0.2);
      margin-left: 0.5rem;
      padding-left: 0.5rem;
    }
  `;

  EventsExtenension = Extension.create({
    onUpdate: () => {
      this.dispatchEvent(new Event('change'));
    },
  });

  tiptap: Editor;

  @property({ attribute: false })
  extensions: AnyExtension[] = [];

  constructor(customExtensions: AnyExtension[] = []) {
    super();

    const extensionsInputs = [...customExtensions, ...this.extensions];

    const extensions = [
      ...(extensionsInputs?.length > 0 ? extensionsInputs : [StarterKit]),
      this.EventsExtenension,
    ];

    this.tiptap = new Editor({
      extensions,
      injectCSS: true,
    });
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

    this.#provideEditorToSlots();
  }

  #provideEditorToSlots() {
    const el = this.querySelector<HTMLElement & { tiptap: Editor }>('[slot]');

    if (el) {
      el.tiptap = this.tiptap;
    }
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

declare global {
  interface HTMLElementTagNameMap {
    'lit-tip-tap': LitTipTap;
  }
}

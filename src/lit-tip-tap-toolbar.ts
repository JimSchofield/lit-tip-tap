import { Editor } from '@tiptap/core';
import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

export class LitTipTapToolbar extends LitElement {
  static override styles = css`
    button.is-active {
      background-color: rgba(0, 0, 0, 0.1);
      font-weight: bold;
    }
  `;

  @property({ attribute: false })
  tiptap?: Editor;

  #onTransaction = () => {
    this.requestUpdate();
  };

  override willUpdate(changed: Map<PropertyKey, unknown>) {
    /*
     * If the editor ever is created or changed, we need to subscribe to the
     * new editor instance.  This is used to let lit know when the editor
     * state has changed, so we can do things like check `this.tiptap.isActive`
     */
    if (changed.has('tiptap')) {
      (changed.get('tiptap') as Editor | undefined)?.off(
        'transaction',
        this.#onTransaction,
      );
      this.tiptap?.on('transaction', this.#onTransaction);
    }
  }

  render() {
    return html`<div part="toolbar">
      <select
        part="heading-select"
        @change=${(e: Event) => {
          if (e.target instanceof HTMLSelectElement) {
            const { value } = e.target;

            if (value === 'paragraph') {
              this.tiptap?.chain().focus().setParagraph().run();
            } else {
              const level = Number(value) as 1 | 2 | 3;
              this.tiptap?.chain().focus().toggleHeading({ level }).run();
            }
          }
        }}
      >
        <option value="paragraph">Paragraph</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
      </select>
      <button
        part="button bold-button"
        class=${classMap({ 'is-active': this.tiptap?.isActive('bold') ?? false })}
        @click=${() => this.tiptap?.chain().focus().toggleBold().run()}
      >
        Bold
      </button>
      <button
        part="button italic-button"
        class=${classMap({ 'is-active': this.tiptap?.isActive('italic') ?? false })}
        @click=${() => this.tiptap?.chain().focus().toggleItalic().run()}
      >
        Italic
      </button>
      <button
        part="button strike-button"
        class=${classMap({ 'is-active': this.tiptap?.isActive('strike') ?? false })}
        @click=${() => this.tiptap?.chain().focus().toggleStrike().run()}
      >
        Strikethrough
      </button>
      <button
        part="button code-button"
        class=${classMap({ 'is-active': this.tiptap?.isActive('code') ?? false })}
        @click=${() => this.tiptap?.chain().focus().toggleCode().run()}
      >
        Code
      </button>
      <button
        part="button bullet-list-button"
        class=${classMap({ 'is-active': this.tiptap?.isActive('bulletList') ?? false })}
        @click=${() => this.tiptap?.chain().focus().toggleBulletList().run()}
      >
        Bullet List
      </button>
      <button
        part="button ordered-list-button"
        class=${classMap({ 'is-active': this.tiptap?.isActive('orderedList') ?? false })}
        @click=${() => this.tiptap?.chain().focus().toggleOrderedList().run()}
      >
        Numbered List
      </button>
      <button
        part="button indent-left-button"
        @click=${() =>
          this.tiptap?.chain().focus().liftListItem('listItem').run()}
      >
        Indent Left
      </button>
      <button
        part="button indent-right-button"
        @click=${() =>
          this.tiptap?.chain().focus().sinkListItem('listItem').run()}
      >
        Indent Right
      </button>
      <button
        part="button blockquote-button"
        class=${classMap({ 'is-active': this.tiptap?.isActive('blockquote') ?? false })}
        @click=${() => this.tiptap?.chain().focus().toggleBlockquote().run()}
      >
        Blockquote
      </button>
      <button
        part="button horizontal-rule-button"
        @click=${() => this.tiptap?.chain().focus().setHorizontalRule().run()}
      >
        Horizontal Rule
      </button>
      <button
        part="button clear-formatting-button"
        @click=${() => this.tiptap?.chain().focus().unsetAllMarks().run()}
      >
        Clear Formatting
      </button>
    </div>`;
  }
}

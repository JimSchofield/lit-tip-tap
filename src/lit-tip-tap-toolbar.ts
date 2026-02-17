import { Editor } from '@tiptap/core';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('lit-tip-tap-toolbar')
export class LitTipTapToolbar extends LitElement {
  @property({ type: Editor })
  tiptap?: Editor;

  render() {
    return html`<div>
      <select
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
      <button @click=${() => this.tiptap?.chain().focus().toggleBold().run()}>
        Bold
      </button>
      <button @click=${() => this.tiptap?.chain().focus().toggleItalic().run()}>
        Italic
      </button>
      <button @click=${() => this.tiptap?.chain().focus().toggleStrike().run()}>
        Strikethrough
      </button>
      <button @click=${() => this.tiptap?.chain().focus().toggleCode().run()}>
        Code
      </button>
      <button
        @click=${() => this.tiptap?.chain().focus().toggleBulletList().run()}
      >
        Bullet List
      </button>
      <button
        @click=${() => this.tiptap?.chain().focus().toggleOrderedList().run()}
      >
        Numbered List
      </button>
      <button
        @click=${() =>
          this.tiptap?.chain().focus().liftListItem('listItem').run()}
      >
        Indent Left
      </button>
      <button
        @click=${() =>
          this.tiptap?.chain().focus().sinkListItem('listItem').run()}
      >
        Indent Right
      </button>
      <button
        @click=${() => this.tiptap?.chain().focus().toggleBlockquote().run()}
      >
        Blockquote
      </button>
      <button
        @click=${() => this.tiptap?.chain().focus().setHorizontalRule().run()}
      >
        Horizontal Rule
      </button>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-tip-tap-toolbar': LitTipTapToolbar;
  }
  interface GlobalEventHandlersEventMap {
    'editor-request': CustomEvent<(editor: Editor) => void>;
  }
}

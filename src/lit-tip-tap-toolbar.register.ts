import { LitTipTapToolbar } from './lit-tip-tap-toolbar.js';

customElements.define('lit-tip-tap-toolbar', LitTipTapToolbar);

declare global {
  interface HTMLElementTagNameMap {
    'lit-tip-tap-toolbar': LitTipTapToolbar;
  }
}

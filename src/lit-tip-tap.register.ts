import { LitTipTap } from './lit-tip-tap.js';

customElements.define('lit-tip-tap', LitTipTap);

declare global {
  interface HTMLElementTagNameMap {
    'lit-tip-tap': LitTipTap;
  }
}

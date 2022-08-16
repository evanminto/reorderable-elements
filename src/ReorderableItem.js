import { css, html } from "https://cdn.skypack.dev/lit@2.2.1";
import BaseElement from './BaseElement.js';
import MoveToTopEvent from './MoveToTopEvent.js';
import MoveUpEvent from './MoveUpEvent.js';
import MoveDownEvent from './MoveDownEvent.js';

/**
 * @customElement reorderable-item
 * @fires reorderable-move-to-top
 * @fires reorderable-move-up
 * @fires reorderable-move-down
 */
export default class ReorderableItem extends BaseElement {
  static tagName = 'reorderable-item';
  static defaultRole = 'listitem';

  static properties = {
    value: {
      type: String,
      attribute: true,
      reflect: true,
    },
  }

  handleClick(event) {
    const button = event.target.closest('button');
    const {
      reorderableTop,
      reorderableUp,
      reorderableDown
    } = button ? button.dataset : {};

    const isTop = reorderableTop !== undefined;
    const isUp = reorderableUp !== undefined;
    const isDown = reorderableDown !== undefined;

    if (isTop || isUp || isDown) {
      event.preventDefault();
    }

    if (isTop) {
      this.dispatchEvent(new MoveToTopEvent());
    } else if (isUp) {
      this.dispatchEvent(new MoveUpEvent());
    } else if (isDown) {
      this.dispatchEvent(new MoveDownEvent());
    }
  }

  render() {
    return html`<slot @click=${this.handleClick}></slot>`;
  }

  static styles = css`
  `;
}

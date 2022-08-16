import { css, html, unsafeCSS } from 'https://cdn.skypack.dev/lit@2.2.1';
import Sortable from 'https://cdn.skypack.dev/sortablejs';
import BaseElement from './BaseElement.js';
import ReorderableItem from './ReorderableItem.js';
import UpdateEvent from './UpdateEvent.js';

export default class ReorderableList extends BaseElement {
  static tagName = 'reorderable-list';
  static defaultRole = 'list';

  static properties = {
    dragAndDropReady: {
      type: String,
      attribute: 'drag-and-drop-ready',
      reflect: true,
    },
    ariaMessage: String,
  }

  connectedCallback() {
    super.connectedCallback();

    this.#handleUpdate = this.#handleUpdate.bind(this);
    this.addEventListener('reorderable-update', this.#handleUpdate);

    Sortable.create(this, {
      draggable: 'reorderable-item',
      ghostClass: 'reorderable-ghost',
      chosenClass: 'reorderable-chosen',
      dragClass: 'reorderable-drag',
      onUpdate: this.#handleSortableUpdate.bind(this),
    });

    this.dragAndDropReady = true;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('reorderable-update', this.#handleUpdate);
  }

  /**
   * @returns {String[]}
   */
  get values() {
    return [...this.querySelectorAll(this.#getChildItemSelector())]
      .map(item => item.value);
  }

  /**
   * @param {String[]} values
   */
  set values(newValues) {
    newValues
      .map(value => this.#getChildItemSelector(value))
      .map(selector => this.querySelector(selector))
      .filter(item => item)
      .forEach(item => this.append(item));
  }

  render() {
    const { ariaMessage } = this;

    return html`
      <slot
        @reorderable-move-to-top=${this.#handleMoveToTop}
        @reorderable-move-up=${this.#handleMoveUp}
        @reorderable-move-down=${this.#handleMoveDown}
      ></slot>

      <output class="aria-message">${ariaMessage}</output>
    `;
  }

  static styles = css`
    :host([drag-and-drop-ready]) ::slotted(${unsafeCSS(ReorderableItem.tagName)}) {
      cursor: grab;
    }

    :host([drag-and-drop-ready]) ::slotted(${unsafeCSS(ReorderableItem.tagName)}:is(.reorderable-chosen, .reorderable-ghost)) {
      cursor: grabbing;
    }

    .aria-message {
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      height: 1px;
      overflow: hidden;
      position: absolute;
      white-space: nowrap;
      width: 1px;
    }
  `;

  /**
   * @param {ReorderableItem} item
   * @param {Function}        getNewIndex
   */
  #moveToIndex(item, getNewIndex) {
    if (item.parentElement !== this) {
      return;
    }

    const { values } = this;
    const oldIndex = values.indexOf(item.value);
    const newIndex = getNewIndex ? getNewIndex(oldIndex) : null;

    this.#updateOrder(item, values, oldIndex, newIndex);
  }

  /**
   *
   * @param {ReorderableItem} item
   * @param {String[]}        oldValues
   * @param {Number}          oldIndex
   * @param {Number}          newIndex
   */
  #updateOrder(item, oldValues, oldIndex, newIndex) {
    if (newIndex === null || newIndex < 0 || newIndex > oldValues.length - 1) {
      return;
    }

    const newValues = [...oldValues];
    // Move value from index to newIndex
    newValues.splice(newIndex, 0, newValues.splice(oldIndex, 1)[0]);

    if (
      !this.dispatchEvent(
        new UpdateEvent({
          before: true,
          item,
          oldIndex,
          newIndex
        })
      )
    ) {
      return;
    }

    this.values = newValues;

    this.dispatchEvent(
      new UpdateEvent({ item, oldIndex, newIndex })
    );
  }

  /**
   * @param {import('./MoveToTopEvent').default} event
   */
  #handleMoveToTop(event) {
    this.#moveToIndex(event.target, () => 0);
  }

  /**
   * @param {import('./MoveUpEvent').default} event
   */
  #handleMoveUp(event) {
    this.#moveToIndex(event.target, index => index - 1);
  }

  /**
   * @param {import('./MoveDownEvent').default} event
   */
  #handleMoveDown(event) {
    this.#moveToIndex(event.target, index => index + 1);
  }

  /**
   * @param {Event} event
   */
  #handleSortableUpdate = event => {
    const { dragged: item, oldIndex, newIndex } = event;

    this.dispatchEvent(
      new UpdateEvent({ item, oldIndex, newIndex })
    );
  }

  /**
   * @param {UpdateEvent} event
   */
  #handleUpdate = event => {
    const { oldIndex, newIndex } = event;

    this.ariaMessage = `Item at index ${oldIndex} moved to index ${newIndex}.`;
  }

  /**
   * @param {String} value
   */
  #getChildItemSelector(value) {
    let item;

    if (value) {
      item = `${ReorderableItem.tagName}[value="${value}"]`;
    } else {
      item = ReorderableItem.tagName;
    }

    return `:scope > ${item}`;
  }
}

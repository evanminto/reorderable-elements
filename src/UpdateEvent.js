export default class UpdateEvent extends Event {
  /** @type {import('./ReorderableItem').default} */
  item;
  /** @type {Number} */
  oldIndex;
  /** @type {Number} */
  newIndex;

  /**
   * @param {Object}                              params
   * @param {import('./ReorderableItem').default} params.item
   * @param {Number}                              params.oldIndex
   * @param {Number}                              params.newIndex
   */
  constructor({ before = false, ...params }) {
    const name = before ? 'reorderable-before-update' : 'reorderable-update';

    super(name, {
      bubbles: true,
      cancelable: before,
    });

    Object.assign(this, params);
  }
}

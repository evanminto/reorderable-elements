export default class MoveToTopEvent extends Event {
  constructor() {
    super('reorderable-move-to-top', {
      bubbles: true,
    });
  }
}

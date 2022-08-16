export default class MoveUpEvent extends Event {
  constructor() {
    super('reorderable-move-up', {
      bubbles: true,
    });
  }
}

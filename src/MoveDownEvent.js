export default class MoveDownEvent extends Event {
  constructor() {
    super('reorderable-move-down', {
      bubbles: true,
    });
  }
}

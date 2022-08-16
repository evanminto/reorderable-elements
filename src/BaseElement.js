import { LitElement } from "https://cdn.skypack.dev/lit@2.2.1";

export default class BaseElement extends LitElement {
  constructor() {
    super();

    if (this.constructor.defaultRole && !this.hasAttribute('role')) {
      this.setAttribute('role', this.constructor.defaultRole);
    }
  }
}

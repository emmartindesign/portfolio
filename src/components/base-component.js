export class BaseComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    // Base render method to be overridden by specific components
  }
}

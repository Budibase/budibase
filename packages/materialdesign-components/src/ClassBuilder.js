export default class ClassBuilder {
  block = "";
  constructor(block) {
    this.block = `mdc-${block}`;
  }
}

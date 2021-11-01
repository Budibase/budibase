import { ComponentBuilder } from "./component-builder"

export class BlockBuilder {
  context
  componentCount = 0

  constructor(context) {
    this.context = context
  }

  createComponent(type, props) {
    return new ComponentBuilder(this, type, props)
  }
}

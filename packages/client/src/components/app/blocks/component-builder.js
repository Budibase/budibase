export class ComponentBuilder {
  context

  constructor(blockBuilder, type, props) {
    this.blockBuilder = blockBuilder
    this.type = type
    this.id = `${blockBuilder.context.id}-${blockBuilder.componentCount++}`
    this.props = props
    this.children = []
    this.styles = null
  }

  setProp(key, value) {
    this.props[key] = value
    return this
  }

  setProps(props) {
    this.props = {
      ...this.props,
      ...props,
    }
    return this
  }

  setStyles(styles) {
    this.styles = styles
    return this
  }

  addChild(component) {
    this.children.push(component)
    return this
  }

  build() {
    return {
      _component: `@budibase/standard-components/${this.type}`,
      _id: this.id,
      _children: this.children?.map(child => child.build()),
      _styles: {
        normal: {
          ...this.styles,
        },
      },
      ...this.props,
    }
  }
}

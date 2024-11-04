import { cloneDeep } from "lodash/fp"

export class BaseStructure {
  constructor(isScreen) {
    this._isScreen = isScreen
    this._children = []
    this._json = {}
  }

  addChild(child) {
    this._children.push(child)
    return this
  }

  customProps(props) {
    for (let key of Object.keys(props)) {
      this._json[key] = props[key]
    }
    return this
  }

  json() {
    const structure = cloneDeep(this._json)
    if (this._children.length !== 0) {
      for (let child of this._children) {
        if (this._isScreen) {
          structure.props._children.push(child.json?.() || child)
        } else {
          structure._children.push(child.json?.() || child)
        }
      }
    }
    return structure
  }
}

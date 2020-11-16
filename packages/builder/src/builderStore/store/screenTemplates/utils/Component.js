import { cloneDeep } from "lodash/fp"
import { v4 } from "uuid"
import { BaseStructure } from "./BaseStructure"

export class Component extends BaseStructure {
  constructor(name) {
    super(false)
    this._children = []
    this._json = {
      _id: v4(),
      _component: name,
      _styles: {
        normal: {},
        hover: {},
        active: {},
        selected: {},
      },
      _code: "",
      className: "",
      onLoad: [],
      type: "",
      _instanceName: "",
      _children: [],
    }
  }

  type(type) {
    this._json.type = type
    return this
  }

  normalStyle(styling) {
    this._json._styles.normal = styling
    return this
  }

  hoverStyle(styling) {
    this._json._styles.hover = styling
    return this
  }

  text(text) {
    this._json.text = text
    return this
  }

  // TODO: do we need this
  instanceName(name) {
    this._json._instanceName = name
    return this
  }
}

import { Document, Component } from "@budibase/types"
import { cloneDeep } from "lodash/fp"

export class BaseStructure<T extends Document> {
  private _isScreen: boolean
  private _children: (Component | BaseStructure<any>)[]
  _json: T

  constructor(isScreen: boolean, initialDoc: T) {
    this._isScreen = isScreen
    this._children = []
    this._json = initialDoc
  }

  addChild(child: Component | BaseStructure<any>) {
    this._children.push(child)
    return this
  }

  customProps(props: Record<string, any>) {
    for (let key of Object.keys(props)) {
      this._json[key as keyof T] = props[key]
    }
    return this
  }

  json() {
    const structure = cloneDeep(this._json)
    if (this._children.length !== 0) {
      for (let child of this._children) {
        if (this._isScreen) {
          ;(structure as any).props._children.push(child.json?.() || child)
        } else {
          ;(structure as any)._children.push(child.json?.() || child)
        }
      }
    }
    return structure
  }
}

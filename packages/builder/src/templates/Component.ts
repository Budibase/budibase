import { Helpers } from "@budibase/bbui"
import { Component as ComponentDoc } from "@budibase/types"
import { BaseStructure } from "./BaseStructure"

export class Component extends BaseStructure<ComponentDoc> {
  constructor(name: string, _id: string = Helpers.uuid()) {
    super(false, {
      _id,
      _component: name,
      _styles: {
        normal: {},
        hover: {},
        active: {},
        selected: {},
      },
      _instanceName: "",
      _children: [],
    })
  }

  normalStyle(styling: any) {
    this._json._styles.normal = styling
    return this
  }

  hoverStyle(styling: any) {
    this._json._styles.hover = styling
    return this
  }

  customStyle(styling: any) {
    this._json._styles.custom = styling
    return this
  }

  instanceName(name: string) {
    this._json._instanceName = name
    return this
  }

  // Shorthand for custom props "type"
  type(type: string) {
    this._json.type = type
    return this
  }

  // Shorthand for custom props "text"
  text(text: string) {
    this._json.text = text
    return this
  }

  getId() {
    return this._json._id
  }

  gridDesktopColSpan(start: number, end: number) {
    this._json._styles.normal["--grid-desktop-col-start"] = start
    this._json._styles.normal["--grid-desktop-col-end"] = end
    return this
  }

  gridDesktopRowSpan(start: number, end: number) {
    this._json._styles.normal["--grid-desktop-row-start"] = start
    this._json._styles.normal["--grid-desktop-row-end"] = end
    return this
  }

  gridMobileColSpan(start: number, end: number) {
    this._json._styles.normal["--grid-mobile-col-start"] = start
    this._json._styles.normal["--grid-mobile-col-end"] = end
    return this
  }

  gridMobileRowSpan(start: number, end: number) {
    this._json._styles.normal["--grid-mobile-row-start"] = start
    this._json._styles.normal["--grid-mobile-row-end"] = end
    return this
  }
}

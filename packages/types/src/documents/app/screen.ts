import { Document } from "../document"
import { Component } from "./component"

export interface ScreenProps extends Component {
  size?: string
  gap?: string
  direction?: string
  vAlign?: string
  hAlign?: string
}

export interface ScreenRouting {
  route: string
  roleId: string
  homeScreen?: boolean
}

export interface Screen extends Document {
  layoutId?: string
  showNavigation?: boolean
  width?: string
  routing: ScreenRouting
  props: ScreenProps
}

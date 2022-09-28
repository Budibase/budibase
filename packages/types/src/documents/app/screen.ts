import { Document } from "../document"

export interface ScreenProps extends Document {
  _instanceName: string
  _styles: { [key: string]: any }
  _component: string
  _children: ScreenProps[]
  size?: string
  gap?: string
  direction?: string
  vAlign?: string
  hAlign?: string
}

export interface Screen extends Document {
  layoutId?: string
  showNavigation?: boolean
  width?: string
  routing: {
    route: string
    roleId: string
    homeScreen?: boolean
  }
  props: ScreenProps
}

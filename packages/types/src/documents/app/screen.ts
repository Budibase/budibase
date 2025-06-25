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

export enum ScreenVariant {
  PDF = "pdf",
}

export interface Screen extends Document {
  layoutId?: string
  showNavigation?: boolean
  width?: string
  routing: ScreenRouting
  props: ScreenProps
  name?: string
  pluginAdded?: boolean
  onLoad?: EventHandler[]
  variant?: ScreenVariant
  workspaceAppId: string
}

export interface ScreenRoutesViewOutput extends Document {
  id: string
  routing: ScreenRouting
}

export type ScreenRoutingJson = Record<
  string,
  {
    subpaths: Record<string, any>
  }
>

export interface EventHandler {
  parameters: {
    key: string
    type: string
    value: string
    persist: any | null
  }
  "##eventHandlerType": string
  id: string
}

import { User, Document } from "../"
import { SocketSession } from "../../sdk"

export type AppMetadataErrors = { [key: string]: string[] }

export interface App extends Document {
  appId: string
  type: string
  version: string
  componentLibraries: string[]
  name: string
  url: string | undefined
  template: string | undefined
  instance: AppInstance
  tenantId: string
  status: string
  theme?: string
  customTheme?: AppCustomTheme
  revertableVersion?: string
  lockedBy?: User
  sessions?: SocketSession[]
  navigation?: AppNavigation
  automationErrors?: AppMetadataErrors
  icon?: AppIcon
  features?: AppFeatures
}

export interface AppInstance {
  _id: string
}

export interface AppNavigation {
  navigation: string
  title: string
  navWidth: string
  sticky?: boolean
  hideLogo?: boolean
  logoUrl?: string
  hideTitle?: boolean
  navBackground?: string
  navTextColor?: string
  links?: AppNavigationLink[]
}

export interface AppNavigationLink {
  text: string
  url: string
  id?: string
  roleId?: string
}

export interface AppCustomTheme {
  buttonBorderRadius?: string
  primaryColor?: string
  primaryColorHover?: string

  // Used to exist before new design UI
  navTextColor?: string
  navBackground?: string
}

export interface AppIcon {
  name: string
  color: string
}

export interface AppFeatures {
  componentValidation?: boolean
  disableUserMetadata?: boolean
}

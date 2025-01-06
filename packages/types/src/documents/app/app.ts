import { User, Document, Plugin, Snippet, Theme } from "../"
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
  theme?: Theme
  customTheme?: AppCustomTheme
  revertableVersion?: string
  lockedBy?: User
  sessions?: SocketSession[]
  navigation?: AppNavigation
  automationErrors?: AppMetadataErrors
  icon?: AppIcon
  features?: AppFeatures
  automations?: AutomationSettings
  usedPlugins?: Plugin[]
  upgradableVersion?: string
  snippets?: Snippet[]
  creationVersion?: string
  updatedBy?: string
}

export interface AppInstance {
  _id: string
}

export interface AppNavigation {
  navigation: string
  title?: string
  navWidth?: string
  sticky?: boolean
  hideLogo?: boolean
  logoUrl?: string
  hideTitle?: boolean
  navBackground?: string
  navTextColor?: string
  links?: AppNavigationLink[]
  textAlign?: string
}

export interface AppNavigationLink {
  text: string
  url: string
  id?: string
  roleId?: string
  type?: string
  subLinks?: AppNavigationLink[]
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
  skeletonLoader?: boolean
}

export interface AutomationSettings {
  chainAutomations?: boolean
}

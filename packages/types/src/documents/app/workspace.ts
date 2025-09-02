import { Document, Plugin, Snippet, Theme, User } from ".."
import { SocketSession } from "../../sdk"

export type WorkspaceMetadataErrors = { [key: string]: string[] }

export interface Workspace extends Document {
  appId: string
  type: string
  version: string
  componentLibraries: string[]
  name: string
  url: string | undefined
  template: string | undefined
  instance: WorkspaceInstance
  tenantId: string
  status: string
  theme?: Theme
  customTheme?: AppCustomTheme
  revertableVersion?: string
  lockedBy?: User
  sessions?: SocketSession[]
  /** @deprecated use workspace app navigation instead */
  navigation?: AppNavigation
  automationErrors?: WorkspaceMetadataErrors
  backupErrors?: WorkspaceMetadataErrors
  icon?: WorkspaceIcon
  features?: WorkspaceFeatures
  automations?: AutomationSettings
  usedPlugins?: Plugin[]
  upgradableVersion?: string
  snippets?: Snippet[]
  creationVersion?: string
  updatedBy?: string
  pwa?: PWAManifest
  scripts?: AppScript[]
  // stores a list of IDs (automations, workspace apps, anything that can be published)
  // and when they were last published (timestamp)
  resourcesPublishedAt?: Record<string, string>
  recaptchaEnabled?: boolean
}

export interface WorkspaceInstance {
  _id: string
}

export interface AppNavigation {
  navigation: "Top" | "Left"
  title?: string
  navWidth?: string
  sticky?: boolean
  hideLogo?: boolean
  logoUrl?: string
  hideTitle?: boolean
  navBackground?: string
  navTextColor?: string
  links?: AppNavigationLink[]
  textAlign?: "Left" | "Center" | "Right"
}

export interface AppNavigationLink {
  text: string
  url: string
  id?: string
  roleId?: string
  type: "link" | "sublinks"
  subLinks?: AppNavigationLink[]
  icon?: string
}

export interface AppCustomTheme {
  buttonBorderRadius?: string
  primaryColor?: string
  primaryColorHover?: string

  // Used to exist before new design UI
  navTextColor?: string
  navBackground?: string
}

export interface WorkspaceIcon {
  name: string
  color: string
}

export interface WorkspaceFeatures {
  componentValidation?: boolean
  disableUserMetadata?: boolean
  skeletonLoader?: boolean
}

export interface AutomationSettings {
  chainAutomations?: boolean
}

export interface PWAManifest {
  name: string
  short_name: string
  description: string
  icons: PWAManifestImage[]
  screenshots: PWAManifestImage[]
  background_color: string
  theme_color: string
  display?: string
  start_url: string
}

export interface PWAManifestImage {
  src: string
  sizes: string
  type: string
  form_factor?: "wide" | "narrow" | undefined
  label?: string
}

export interface AppScript {
  id: string
  name: string
  location: "Head" | "Body"
  html?: string
  cspWhitelist?: string
}

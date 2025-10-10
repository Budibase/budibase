import { Plugin } from "../"

export interface BudibaseAppProps {
  title: string
  favicon: string
  metaImage: string
  metaTitle: string
  metaDescription: string
  clientCacheKey?: string
  workspaceId: string
  usedPlugins: Plugin[]
  appMigrating?: boolean
  showSkeletonLoader?: boolean
  hideDevTools?: boolean
  sideNav?: boolean
  hideFooter?: boolean
  nonce?: string
  headAppScripts?: string
  bodyAppScripts?: string
  recaptchaKey?: string
}

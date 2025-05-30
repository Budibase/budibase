import { AppNavigation } from "@budibase/types"

export interface Table {
  _id: string
  _rev?: string
  type?: string
  views?: {}
  name?: string
  primary?: string[]
  schema: {
    [key: string]: {
      // TODO: replace with field types enum when done
      type: string
      fieldName?: string
      name: string
      constraints?: {
        type?: string
        email?: boolean
        inclusion?: string[]
        length?: {
          minimum?: string | number
          maximum?: string | number
        }
        presence?: boolean
      }
    }
  }
  primaryDisplay?: string
  sourceId?: string
}

export interface BudibaseAppMetadata {
  _id: string
  _rev?: string
  appId: string
  type: string
  version: string
  componentlibraries: string[]
  name: string
  url: string
  instance: { _id: string }
  updatedAt: Date
  createdAt: Date
}

export function defaultAppNavigator(name: string): AppNavigation {
  return {
    navigation: "Top",
    title: name,
    navWidth: "Large",
    navBackground: "var(--spectrum-global-color-static-blue-1200)",
    navTextColor: "var(--spectrum-global-color-static-white)",
    links: [],
  }
}

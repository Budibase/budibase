import type { ComponentSetting } from "@budibase/types"

type Resolver = (setting: ComponentSetting) => any

let resolver: Resolver | null = null

export const setComponentSettingsResolver = (next: Resolver) => {
  resolver = next
}

export const getComponentForSetting = (setting: ComponentSetting) => {
  return resolver ? resolver(setting) : null
}

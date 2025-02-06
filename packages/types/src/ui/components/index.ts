export * from "./sidepanel"
export * from "./codeEditor"
export * from "./errors"

export interface CustomComponent {
  Component: any
  schema: {
    type: "component"
    metadata: Record<string, any>
    schema: ComponentDefinition
  }
  version: string
}

export interface ComponentDefinition {
  component: string
  name: string
  friendlyName?: string
  hasChildren?: boolean
  settings?: ComponentSetting[]
  features?: Record<string, boolean>
  typeSupportPresets?: Record<string, any>
  legalDirectChildren: string[]
  requiredAncestors?: string[]
  illegalChildren: string[]
  icon?: string
  size?: {
    width: number
    height: number
  }
}

export interface ComponentSetting {
  key: string
  type: string
  label?: string
  section?: string
  name?: string
  defaultValue?: any
  selectAllFields?: boolean
  resetOn?: string | string[]
  settings?: ComponentSetting[]
  dependsOn?:
    | string
    | {
        setting: string
        value: string
      }
}

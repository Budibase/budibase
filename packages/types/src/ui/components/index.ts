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
  context?: ComponentContext | ComponentContext[]
  actions?: (string | any)[]
}

export type DependsOnComponentSetting =
  | string
  | {
      setting: string
      value: string
    }

export interface ComponentSetting {
  key: string
  type: string
  label?: string
  section?: string
  name?: string
  required?: boolean
  defaultValue?: any
  selectAllFields?: boolean
  resetOn?: string | string[]
  settings?: ComponentSetting[]
  nested?: boolean
  dependsOn?: DependsOnComponentSetting
  sectionDependsOn?: DependsOnComponentSetting
  contextAccess?: {
    global: boolean
    self: boolean
  }
}
interface ComponentAction {
  type: string
  suffix?: string
}

interface ComponentStaticContextValue {
  label: string
  key: string
  type: string // technically this is a long list of options but there are too many to enumerate
}

export interface ComponentContext {
  type: ComponentContextType
  scope?: ComponentContextScopes
  actions?: ComponentAction[]
  suffix?: string
  values?: ComponentStaticContextValue[]
}

export type ComponentContextType = "action" | "static" | "schema" | "form"

export const enum ComponentContextScopes {
  Local = "local",
  Global = "global",
}

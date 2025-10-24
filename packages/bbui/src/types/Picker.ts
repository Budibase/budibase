import type { ComponentType } from "svelte"

type ComponentIcon = {
  type: "component"
  component: ComponentType
  props?: Record<string, unknown>
}

type StringIcon = {
  type: "string"
  value: string
}

export type ResolvedIcon = ComponentIcon | StringIcon

export type PickerIconInput =
  | string
  | {
      component: ComponentType
      props?: Record<string, unknown>
    }
  | null
  | undefined

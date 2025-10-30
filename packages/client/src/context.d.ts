import type { Writable } from "svelte/store"
import type {
  Component as ComponentStore,
  Context,
  FieldGroupContext,
  FormContext,
} from "@/types"
import type { SDK } from "@/index"

declare module "svelte" {
  export function getContext(key: "sdk"): SDK
  export function getContext(key: "component"): ComponentStore
  export function getContext(key: "current-step"): Writable<number>
  export function getContext(key: "context"): Context
  export function getContext(key: "form"): FormContext | undefined
  export function getContext(key: "form-step"): Writable<number> | undefined
  export function getContext(key: "field-group"): FieldGroupContext | undefined
}

import { Writable } from "svelte"
import { Component, FieldGroupContext, FormContext } from "@/types"
import { Readable } from "svelte/store"
import { SDK } from "@/index.ts"

declare module "svelte" {
  export function getContext(key: "sdk"): SDK
  export function getContext(key: "component"): Component
  export function getContext(key: "context"): Readable<Record<string, any>>
  export function getContext(key: "form"): FormContext | undefined
  export function getContext(key: "form-step"): Writable<number> | undefined
  export function getContext(key: "field-group"): FieldGroupContext | undefined
}

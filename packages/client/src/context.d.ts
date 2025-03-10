import { Writable } from "svelte"
import { Component, Context, FieldGroupContext, FormContext, SDK } from "."

declare module "svelte" {
  export function getContext(key: "sdk"): SDK
  export function getContext(key: "component"): Component
  export function getContext(key: "context"): Context
  export function getContext(key: "form"): FormContext | undefined
  export function getContext(key: "form-step"): Writable<number> | undefined
  export function getContext(key: "field-group"): FieldGroupContext | undefined
}

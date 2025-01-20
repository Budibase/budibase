import { Readable } from "svelte/store"
import { Component, Context, SDK } from "."

declare module "svelte" {
  export function getContext(key: "sdk"): SDK
  export function getContext(key: "component"): Readable<Component>
  export function getContext(key: "context"): Readable<Context>
}

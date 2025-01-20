import { Component, Context, SDK } from "."

declare module "svelte" {
  export function getContext(key: "sdk"): SDK
  export function getContext(key: "component"): Component
  export function getContext(key: "context"): Context
}

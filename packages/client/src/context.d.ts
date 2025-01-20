import { Component, Context, SDK } from "."

declare module "svelte" {
  function getContext(name: "sdk"): SDK
  function getContext(name: "component"): Component
  function getContext(name: "context"): Context
}

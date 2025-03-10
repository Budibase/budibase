import { Context } from "."

declare module "svelte" {
  export function getContext(key: Context.Modal): {
    hide: () => void
    cancel: () => void
  }
}

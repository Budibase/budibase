import { ActionMenu } from "./types"

declare module "svelte" {
  export function getContext(key: "actionMenu"): ActionMenu | undefined
}

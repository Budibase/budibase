import { ActionMenu } from "./types"

declare module "svelte" {
  export function getContext(key: "actionMenu"): ActionMenu | undefined
}

export const Modal = "bbui-modal"
export const PopoverRoot = "bbui-popover-root"

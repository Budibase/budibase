import { ActionMenu } from "./types"
import { ModalContext } from "./types"

declare module "svelte" {
  export function getContext(key: "actionMenu"): ActionMenu | undefined
  export function getContext(key: "bbui-modal"): ModalContext
}

export const Modal = "bbui-modal"
export const PopoverRoot = "bbui-popover-root"

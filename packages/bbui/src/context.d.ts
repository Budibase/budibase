import { ActionMenu, ModalContext, ScrollContext } from "./types"

declare module "svelte" {
  export function getContext(key: "actionMenu"): ActionMenu | undefined
  export function getContext(key: "bbui-modal"): ModalContext
  export function getContext(key: "scroll"): ScrollContext
}

export const Modal = "bbui-modal"
export const PopoverRoot = "bbui-popover-root"

import { Readable } from "svelte/store"
import { ActionMenu, ModalContext, ScrollContext } from "./types"

declare module "svelte" {
  export function getContext(key: "actionMenu"): ActionMenu | undefined
  export function getContext(key: "bbui-modal"): ModalContext
  export function getContext(key: "scroll"): ScrollContext
  export function getContext(key: "grid"): {
    datasource: Readable<{
      id: string
      tableId: string
      type: string
    }>
  }
  export function getContext(key: "fancy-form"): {
    registerField: (id: string, api: { validate: () => boolean }) => void
    unregisterField: (id: string) => void
  }
}

export const Modal = "bbui-modal"
export const PopoverRoot = "bbui-popover-root"

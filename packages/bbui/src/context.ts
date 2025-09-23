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
}

interface Module {
  Modal: "bbui-modal"
  PopoverRoot: "bbui-popover-root"
}

export default {
  Modal: "bbui-modal",
  PopoverRoot: "bbui-popover-root",
} as Module

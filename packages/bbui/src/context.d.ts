declare module "svelte" {
  export function getContext(key: Context.Modal): {
    hide: () => void
    cancel: () => void
  }
  export function getContext(key: Context.Popover): {
    show: () => void
    hide: () => void
  }
  export function getContext(key: "actionMenu"): {
    hideAll: () => void
  }
}

export default {
  Modal: "bbui-modal",
  PopoverRoot: "bbui-popover-root",
} as const

export namespace Context {
  type Modal = "bbui-modal"
  type PopoverRoot = "bbui-popover-root"
}

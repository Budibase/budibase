declare module "svelte" {
  export function getContext(key: "bbui-modal"): {
    hide: () => void
    cancel: () => void
  }
  export function getContext(key: "bbui-popover-root"): {
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

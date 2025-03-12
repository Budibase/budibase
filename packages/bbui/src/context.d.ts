declare module "svelte" {
  export function getContext(key: "bbui-modal"): {
    hide: () => void
    cancel: () => void
    show: () => void
  }
  export function getContext(key: "bbui-popover-root"): {
    show: () => void
    hide: () => void
  }
  export function getContext(key: "actionMenu"): {
    hideAll: () => void
  }
}

declare const Context: {
  readonly Modal: "bbui-modal"
  readonly PopoverRoot: "bbui-popover-root"
}

export default Context

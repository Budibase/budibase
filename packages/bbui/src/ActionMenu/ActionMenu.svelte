<script lang="ts">
  import { setContext, getContext } from "svelte"
  import Popover from "../Popover/Popover.svelte"
  import Menu from "../Menu/Menu.svelte"
  import type { PopoverAlignment } from "../constants"

  export let disabled: boolean = false
  export let align: `${PopoverAlignment}` = "left"
  export let portalTarget: string | undefined = undefined
  export let openOnHover: boolean = false
  export let animate: boolean | undefined = true
  export let offset: number | undefined = undefined
  export let useAnchorWidth = false
  export let roundedPopover: boolean = false

  const actionMenuContext = getContext("actionMenu")

  let anchor: HTMLElement | undefined
  let dropdown: Popover
  let timeout: ReturnType<typeof setTimeout>
  let open = false

  // This is needed because display: contents is considered "invisible".
  // It should only ever be an action button, so should be fine.
  function getAnchor(node: HTMLDivElement) {
    anchor = (node.firstChild as HTMLElement) ?? undefined
  }

  export const show = () => {
    cancelHide()
    dropdown.show()
  }

  export const hide = () => {
    dropdown.hide()
  }

  // Hides this menu and all parent menus
  const hideAll = () => {
    hide()
    actionMenuContext?.hide()
  }

  const openMenu = (event: Event) => {
    if (!disabled) {
      event.stopPropagation()
      show()
    }
  }

  const queueHide = () => {
    timeout = setTimeout(hide, 10)
  }

  const cancelHide = () => {
    clearTimeout(timeout)
  }

  setContext("actionMenu", { show, hide, hideAll })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  use:getAnchor
  on:click={openOnHover ? null : openMenu}
  on:mouseenter={openOnHover ? show : null}
  on:mouseleave={openOnHover ? queueHide : null}
>
  <slot name="control" {open} />
</div>
<Popover
  bind:this={dropdown}
  {anchor}
  {align}
  {portalTarget}
  {animate}
  {offset}
  {useAnchorWidth}
  resizable={false}
  borderRadius={roundedPopover ? "12px" : undefined}
  on:open
  on:close
  on:mouseenter={openOnHover ? cancelHide : null}
  on:mouseleave={openOnHover ? queueHide : null}
  bind:open
>
  <Menu>
    <slot />
  </Menu>
</Popover>

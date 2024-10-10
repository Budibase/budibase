<script>
  import { setContext, getContext } from "svelte"
  import Popover from "../Popover/Popover.svelte"
  import Menu from "../Menu/Menu.svelte"

  export let disabled = false
  export let align = "left"
  export let portalTarget
  export let openOnHover = false
  export let animate
  export let offset

  const actionMenuContext = getContext("actionMenu")

  let anchor
  let dropdown
  let timeout

  // This is needed because display: contents is considered "invisible".
  // It should only ever be an action button, so should be fine.
  function getAnchor(node) {
    anchor = node.firstChild
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

  const openMenu = event => {
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
  <slot name="control" />
</div>
<Popover
  bind:this={dropdown}
  {anchor}
  {align}
  {portalTarget}
  {animate}
  {offset}
  resizable={false}
  on:open
  on:close
  on:mouseenter={openOnHover ? cancelHide : null}
  on:mouseleave={openOnHover ? queueHide : null}
>
  <Menu>
    <slot />
  </Menu>
</Popover>

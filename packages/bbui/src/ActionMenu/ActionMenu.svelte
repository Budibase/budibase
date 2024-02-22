<script>
  import { setContext } from "svelte"
  import Popover from "../Popover/Popover.svelte"
  import Menu from "../Menu/Menu.svelte"

  export let disabled = false
  export let align = "left"
  export let portalTarget

  let anchor
  let dropdown

  // This is needed because display: contents is considered "invisible".
  // It should only ever be an action button, so should be fine.
  function getAnchor(node) {
    anchor = node.firstChild
  }

  export const hide = () => {
    dropdown.hide()
  }
  export const show = () => {
    dropdown.show()
  }

  const openMenu = event => {
    if (!disabled) {
      event.stopPropagation()
      show()
    }
  }

  setContext("actionMenu", { show, hide })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div use:getAnchor on:click={openMenu}>
  <slot name="control" />
</div>
<Popover bind:this={dropdown} {anchor} {align} {portalTarget}>
  <Menu>
    <slot />
  </Menu>
</Popover>

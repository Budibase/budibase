<script>
  import Popover from "../Popover/Popover.svelte"
  import Menu from "../Menu/Menu.svelte"
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

  const closeOnClickWrapper = (cb) => {
    dropdown.hide()
    cb()
  }
</script>

<div class="contents" use:getAnchor on:click={dropdown.show}>
  <slot name="button" />
</div>
<Popover bind:this={dropdown} {anchor} align="left">
  <Menu>
    <slot closeOnClick={closeOnClickWrapper} />
  </Menu>
</Popover>

<style>
  div {
    display: contents;
  }
</style>

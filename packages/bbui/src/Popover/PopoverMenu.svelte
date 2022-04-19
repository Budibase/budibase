<script>
  import { setContext } from "svelte"
  import Popover from "../Popover/Popover.svelte"

  export let disabled = false
  export let align = "left"

  export let anchor
  export let showTip = true
  export let direction = "bottom"

  let dropdown
  let tipSvg =
    '<svg xmlns="http://www.w3.org/svg/2000" width="23" height="12" class="spectrum-Popover-tip" > <path class="spectrum-Popover-tip-triangle" d="M 0.7071067811865476 0 L 11.414213562373096 10.707106781186548 L 22.121320343559645 0" /> </svg>'

  // This is needed because display: contents is considered "invisible".
  // It should only ever be an action button, so should be fine.
  function getAnchor(node) {
    if (!anchor) {
      anchor = node.firstChild
    }
  }

  //need this for the publish/view behaviours
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

  setContext("popoverMenu", { show, hide })
</script>

<div class="popover-menu">
  <div use:getAnchor on:click={openMenu}>
    <slot name="control" />
  </div>
  <Popover
    bind:this={dropdown}
    {anchor}
    {align}
    class={showTip
      ? `spectrum-Popover--withTip spectrum-Popover--${direction}`
      : ""}
  >
    {#if showTip}
      {@html tipSvg}
    {/if}

    <div class="popover-container">
      <div class="popover-menu-wrap">
        <slot />
      </div>
    </div>
  </Popover>
</div>

<style>
  :global(.spectrum-Popover.is-open.spectrum-Popover--withTip) {
    margin-top: var(--spacing-xs);
    margin-left: var(--spacing-xl);
  }
  .popover-menu-wrap {
    padding: 10px;
  }
  .popover-menu :global(.icon) {
    display: flex;
  }
  :global(.spectrum-Popover--bottom .spectrum-Popover-tip) {
    left: 90%;
    margin-left: calc(var(--spectrum-global-dimension-size-150) * -1);
  }
</style>

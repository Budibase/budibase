<script>
  import "@spectrum-css/popover/dist/index-vars.css"
  import Portal from "svelte-portal"
  import { createEventDispatcher } from "svelte"
  import positionDropdown from "../Actions/position_dropdown"
  import clickOutside from "../Actions/click_outside"
  import { fly } from "svelte/transition"
  import { getContext } from "svelte"
  import Context from "../context"

  const dispatch = createEventDispatcher()

  export let anchor
  export let align = "right"
  export let portalTarget
  export let maxWidth
  export let maxHeight
  export let open = false
  export let useAnchorWidth = false
  export let dismissible = true
  export let offset = 5
  export let offsetBelow
  export let customHeight
  export let animate = true
  export let customZindex

  export let handlePostionUpdate
  export let showPopover = true
  export let clickOutsideOverride = false

  $: target = portalTarget || getContext(Context.PopoverRoot) || ".spectrum"

  export const show = () => {
    dispatch("open")
    open = true
  }

  export const hide = () => {
    dispatch("close")
    open = false
  }

  export const toggle = () => {
    if (!open) {
      show()
    } else {
      hide()
    }
  }

  const handleOutsideClick = e => {
    if (clickOutsideOverride) {
      return
    }
    if (open) {
      // Stop propagation if the source is the anchor
      let node = e.target
      let fromAnchor = false
      while (!fromAnchor && node && node.parentNode) {
        fromAnchor = node === anchor
        node = node.parentNode
      }
      if (fromAnchor) {
        e.stopPropagation()
      }

      // Hide the popover
      hide()
    }
  }

  function handleEscape(e) {
    if (!clickOutsideOverride) {
      return
    }
    if (open && e.key === "Escape") {
      hide()
    }
  }
</script>

{#if open}
  <Portal {target}>
    <div
      tabindex="0"
      use:positionDropdown={{
        anchor,
        align,
        maxHeight,
        maxWidth,
        useAnchorWidth,
        offset,
        offsetBelow,
        customUpdate: handlePostionUpdate,
      }}
      use:clickOutside={{
        callback: dismissible ? handleOutsideClick : () => {},
        anchor,
      }}
      on:keydown={handleEscape}
      class="spectrum-Popover is-open"
      class:customZindex
      class:hide-popover={open && !showPopover}
      role="presentation"
      style="height: {customHeight}; --customZindex: {customZindex};"
      transition:fly|local={{ y: -20, duration: animate ? 200 : 0 }}
    >
      <slot />
    </div>
  </Portal>
{/if}

<style>
  .hide-popover {
    display: contents;
  }

  .spectrum-Popover {
    min-width: var(--spectrum-global-dimension-size-2000);
    border-color: var(--spectrum-global-color-gray-300);
    overflow: auto;
  }

  .customZindex {
    z-index: var(--customZindex) !important;
  }
</style>

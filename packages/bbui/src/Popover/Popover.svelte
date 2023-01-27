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
  export let dataCy
  export let maxWidth
  export let direction = "bottom"
  export let showTip = false
  export let open = false
  export let useAnchorWidth = false
  export let dismissible = true

  let tipSvg =
    '<svg xmlns="http://www.w3.org/svg/2000" width="23" height="12" class="spectrum-Popover-tip" > <path class="spectrum-Popover-tip-triangle" d="M 0.7071067811865476 0 L 11.414213562373096 10.707106781186548 L 22.121320343559645 0" /> </svg>'

  $: tooltipClasses = showTip
    ? `spectrum-Popover--withTip spectrum-Popover--${direction}`
    : ""
  $: target = portalTarget || getContext(Context.PopoverRoot) || ".spectrum"

  export const show = () => {
    dispatch("open")
    open = true
  }

  export const hide = () => {
    dispatch("close")
    open = false
  }

  const handleOutsideClick = e => {
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
        maxWidth,
        useAnchorWidth,
        showTip,
      }}
      use:clickOutside={{
        callback: dismissible ? handleOutsideClick : () => {},
        anchor,
      }}
      on:keydown={handleEscape}
      class={"spectrum-Popover is-open " + (tooltipClasses || "")}
      role="presentation"
      data-cy={dataCy}
      transition:fly|local={{ y: -20, duration: 200 }}
    >
      {#if showTip}
        {@html tipSvg}
      {/if}

      <slot />
    </div>
  </Portal>
{/if}

<style>
  .spectrum-Popover {
    min-width: var(--spectrum-global-dimension-size-2000);
    border-color: var(--spectrum-global-color-gray-300);
  }
  .spectrum-Popover.is-open.spectrum-Popover--withTip {
    margin-top: var(--spacing-xs);
    margin-left: var(--spacing-xl);
  }
  :global(.spectrum-Popover--bottom .spectrum-Popover-tip),
  :global(.spectrum-Popover--top .spectrum-Popover-tip) {
    left: 90%;
    margin-left: calc(var(--spectrum-global-dimension-size-150) * -1);
  }
</style>

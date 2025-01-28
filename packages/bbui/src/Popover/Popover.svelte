<script lang="ts">
  import "@spectrum-css/popover/dist/index-vars.css"
  // @ts-expect-error no types for the version of svelte-portal we're on.
  import Portal from "svelte-portal"
  import { createEventDispatcher, getContext, onDestroy } from "svelte"
  import positionDropdown, {
    type UpdateHandler,
  } from "../Actions/position_dropdown"
  import clickOutside from "../Actions/click_outside"
  import { fly } from "svelte/transition"
  import Context from "../context"
  import type { KeyboardEventHandler } from "svelte/elements"

  const dispatch = createEventDispatcher<{ open: void; close: void }>()

  export let anchor: HTMLElement
  export let align: "left" | "right" | "left-outside" | "right-outside" =
    "right"
  export let portalTarget: string | undefined = undefined
  export let minWidth: number | undefined = undefined
  export let maxWidth: number | undefined = undefined
  export let maxHeight: number | undefined = undefined
  export let open = false
  export let useAnchorWidth = false
  export let dismissible = true
  export let offset = 4
  export let customHeight: string | undefined = undefined
  export let animate = true
  export let customZindex: string | undefined = undefined
  export let handlePostionUpdate: UpdateHandler | undefined = undefined
  export let showPopover = true
  export let clickOutsideOverride = false
  export let resizable = true
  export let wrap = false

  const animationDuration = 260

  let timeout: ReturnType<typeof setTimeout>
  let blockPointerEvents = false

  $: target = portalTarget || getContext(Context.PopoverRoot) || ".spectrum"
  $: {
    // Disable pointer events for the initial part of the animation, because we
    // fly from top to bottom and initially can be positioned under the cursor,
    // causing a flashing hover state in the content
    if (open && animate) {
      blockPointerEvents = true
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        blockPointerEvents = false
      }, animationDuration / 2)
    }
  }

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

  const handleOutsideClick = (e: MouseEvent) => {
    if (clickOutsideOverride) {
      return
    }
    if (open) {
      // Stop propagation if the source is the anchor
      let node = e.target as Node | null
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

  const handleEscape: KeyboardEventHandler<HTMLDivElement> = e => {
    if (!clickOutsideOverride) {
      return
    }
    if (open && e.key === "Escape") {
      hide()
    }
  }

  onDestroy(() => {
    clearTimeout(timeout)
  })
</script>

{#if open}
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <Portal {target}>
    <div
      tabindex="0"
      use:positionDropdown={{
        anchor,
        align,
        maxHeight,
        maxWidth,
        minWidth,
        useAnchorWidth,
        offset,
        customUpdate: handlePostionUpdate,
        resizable,
        wrap,
      }}
      use:clickOutside={{
        callback: dismissible ? handleOutsideClick : () => {},
        anchor,
      }}
      on:keydown={handleEscape}
      class="spectrum-Popover is-open"
      class:customZindex
      class:hidden={!showPopover}
      class:blockPointerEvents
      role="presentation"
      style="height: {customHeight}; --customZindex: {customZindex};"
      transition:fly|local={{
        y: -20,
        duration: animate ? animationDuration : 0,
      }}
      on:mouseenter
      on:mouseleave
    >
      <slot />
    </div>
  </Portal>
{/if}

<style>
  .spectrum-Popover {
    min-width: var(--spectrum-global-dimension-size-2000);
    border-color: var(--spectrum-global-color-gray-300);
    overflow: auto;
    transition: opacity 260ms ease-out;
    filter: none;
    -webkit-filter: none;
    box-shadow: 0 1px 4px var(--drop-shadow);
  }
  .blockPointerEvents {
    pointer-events: none;
  }
  .hidden {
    opacity: 0;
    pointer-events: none;
  }
  .customZindex {
    z-index: var(--customZindex) !important;
  }
</style>

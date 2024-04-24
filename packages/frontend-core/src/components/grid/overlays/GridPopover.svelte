<script>
  import { Popover, clickOutside } from "@budibase/bbui"
  import { createEventDispatcher, getContext } from "svelte"
  import {
    PopoverMinWidth,
    PopoverMaxWidth,
    PopoverMaxHeight,
  } from "../lib/constants"

  export let anchor
  export let invertX
  export let minWidth = PopoverMinWidth
  export let maxWidth = PopoverMaxWidth
  export let maxHeight = PopoverMaxHeight

  const { gridID } = getContext("grid")
  const dispatch = createEventDispatcher()

  $: style = buildStyles(minWidth, maxWidth, maxHeight)

  const buildStyles = (minWidth, maxWidth, maxHeight) => {
    let style = ""
    if (minWidth != null) {
      style += `min-width: ${minWidth}px;`
    }
    if (maxWidth != null) {
      style += `max-width: ${maxWidth}px;`
    }
    if (maxHeight != null) {
      style += `max-height: ${maxHeight}px;`
    }
    return style
  }
</script>

<Popover
  open
  {anchor}
  align={invertX ? "right" : "left"}
  portalTarget="#{gridID} .grid-popover-container"
  offset={1}
>
  <div
    class="grid-popover-contents"
    {style}
    use:clickOutside={() => dispatch("close")}
    on:wheel={e => e.stopPropagation()}
  >
    <slot />
  </div>
</Popover>

<style>
  :global(.grid-popover-container .spectrum-Popover) {
    background: var(--grid-background-alt);
    border: var(--cell-border);
    min-width: none;
    max-width: none;
    overflow: hidden;
  }
  .grid-popover-contents {
    overflow-y: auto;
    overflow-x: hidden;
  }
</style>

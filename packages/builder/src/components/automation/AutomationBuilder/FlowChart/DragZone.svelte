<script lang="ts">
  import { onDestroy, onMount } from "svelte"
  import { generate } from "shortid"
  import { dragState } from "./FlowCanvas/DragState"

  export let path: any
  export let variant = "inline"
  // Optional explicit sizing for edge variant (used to improve LR layout)
  export let width: number | undefined = undefined
  export let height: number | undefined = undefined

  let dzid = generate()

  // Reactive drag state
  $: isDropTarget = $dragState.dropTarget === dzid
  $: showDropZone = $dragState.isDragging

  onMount(() => {
    dragState.registerDropZone(dzid, { path })
  })

  onDestroy(() => {
    dragState.unregisterDropZone(dzid)
  })
</script>

<div
  id={`dz-${dzid}`}
  class="drag-zone"
  class:edge={variant === "edge"}
  class:drag-over={isDropTarget}
  style={variant === "edge" && (width || height)
    ? `width: ${width ? Math.round(width) + "px" : "auto"}; height: ${
        height ? Math.round(height) + "px" : "auto"
      };`
    : undefined}
>
  <span class="move-to">Move to</span>
</div>

<style>
  .drag-zone.drag-over {
    background-color: #1ca872b8;
  }
  .drag-zone {
    min-height: calc(var(--spectrum-global-dimension-size-225) + 12px);
    min-width: 100%;
    background-color: rgba(28, 168, 114, 0.2);
    border-radius: 12px;
    border: 1px dashed #1ca872;
    position: relative;
    text-align: center;
  }
  /* Floating variant used on edges */
  .drag-zone.edge {
    /* Allow width/height to be overridden inline for LR layout */
    min-width: 160px;
    width: 320px;
    min-height: 48px;
    height: 56px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .move-to {
    position: absolute;
    left: 0;
    right: 0;
    top: -50%;
    margin: auto;
    width: fit-content;
    font-weight: 600;
    border-radius: 8px;
    padding: 4px 8px;
    background-color: rgb(28, 168, 114);
    color: var(--spectrum-global-color-gray-50);
  }
  .drag-zone.edge .move-to {
    position: static;
    margin: 0;
  }
</style>

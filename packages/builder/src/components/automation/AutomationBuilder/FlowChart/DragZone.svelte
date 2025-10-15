<script lang="ts">
  import { getContext, onDestroy, onMount } from "svelte"
  import { type Writable } from "svelte/store"
  import { generate } from "shortid"
  import type { DragView } from "./FlowCanvas/FlowChartDnD"

  export let path: any
  export let variant = "inline"
  // Optional explicit sizing for edge variant (used to improve LR layout)
  export let width: number | undefined = undefined
  export let height: number | undefined = undefined

  let dropEle: HTMLDivElement | null = null
  let dzid = generate()

  const view = getContext<Writable<DragView>>("draggableView")

  onMount(() => {
    // Always return up-to-date values
    view.update((state: DragView) => {
      return {
        ...state,
        dropzones: {
          ...(state.dropzones || {}),
          [dzid]: {
            get dims() {
              return dropEle ? dropEle.getBoundingClientRect() : new DOMRect()
            },
            path,
          },
        },
      }
    })
  })

  onDestroy(() => {
    view.update((state: DragView) => {
      const { [dzid]: _removed, ...remaining } = state.dropzones
      const droptarget = state.droptarget === dzid ? null : state.droptarget
      return { ...state, dropzones: remaining, droptarget }
    })
  })
</script>

<div
  id={`dz-${dzid}`}
  bind:this={dropEle}
  class="drag-zone"
  class:edge={variant === "edge"}
  class:drag-over={$view?.droptarget === dzid}
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

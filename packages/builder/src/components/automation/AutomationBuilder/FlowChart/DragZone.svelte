<script lang="ts">
  import { getContext, onDestroy, onMount } from "svelte"
  import { type Writable } from "svelte/store"
  import { generate } from "shortid"
  import { selectedAutomation } from "@/stores/builder"
  import type { DragView } from "./FlowCanvas/FlowChartDnD"
  import type { BlockPath } from "@budibase/types"

  export let path: any
  export let variant = "inline"
  // Optional explicit sizing for edge variant (used to improve LR layout)
  export let width: number | undefined = undefined
  export let height: number | undefined = undefined

  let dropEle: HTMLDivElement | null = null
  let dzid = generate()

  const view = getContext<Writable<DragView>>("draggableView")

  $: sourcePath = $view?.moveStep?.id
    ? $selectedAutomation?.blockRefs?.[$view.moveStep.id]?.pathTo
    : undefined
  $: validDropZone = !isNoOpMove(sourcePath, path)

  const sameContainer = (sourcePath: BlockPath[], destPath: BlockPath[]) => {
    const sourceContainer = sourcePath.slice(0, -1)
    const destContainer = destPath.slice(0, -1)
    if (JSON.stringify(sourceContainer) !== JSON.stringify(destContainer)) {
      return false
    }

    const sourceEnd = sourcePath.at(-1)
    const destEnd = destPath.at(-1)
    return (
      sourceEnd?.branchIdx === destEnd?.branchIdx &&
      sourceEnd?.branchStepId === destEnd?.branchStepId &&
      sourceEnd?.loopStepId === destEnd?.loopStepId
    )
  }

  const isNoOpMove = (
    sourcePath: BlockPath[] | undefined,
    destPath: BlockPath[] | undefined
  ) => {
    if (!sourcePath || !destPath) {
      return false
    }

    const sourceEnd = sourcePath.at(-1)
    const destEnd = destPath.at(-1)
    if (!sourceEnd || !destEnd) {
      return false
    }

    const isOwnDragZone = sourceEnd.id === destEnd.id
    const isFirstBranchStep =
      destEnd.branchStepId &&
      destEnd.branchIdx === sourceEnd.branchIdx &&
      sourceEnd.stepIdx === 0
    const isPreviousSibling =
      sameContainer(sourcePath, destPath) &&
      destEnd.stepIdx === sourceEnd.stepIdx - 1

    return isOwnDragZone || isFirstBranchStep || isPreviousSibling
  }

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

{#if validDropZone}
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
{/if}

<style>
  .drag-zone.drag-over {
    background-color: #1ca872b8;
  }
  .drag-zone {
    min-height: calc(var(--spectrum-global-dimension-size-225) + 4px);
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

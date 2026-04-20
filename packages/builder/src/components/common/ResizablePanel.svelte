<script lang="ts">
  import { onDestroy, onMount } from "svelte"
  import { builderStore } from "@/stores/builder"
  import { getHorizontalResizeActions } from "@/components/common/resizable"

  export let storageKey: string | undefined = undefined
  export let defaultWidth = 260
  export let minWidth = 260
  export let maxWidth: number | undefined = undefined
  export let maxWidthRatio: number | undefined = undefined
  export let position: "left" | "right" = "left"
  export let onResizeStart: () => void = () => {}

  let width = defaultWidth
  let computedMaxWidth = defaultWidth

  const clampWidth = (value: number) =>
    Math.max(minWidth, Math.min(value, computedMaxWidth))

  const updateMaxWidth = () => {
    const maxValues: number[] = []
    if (Number.isFinite(maxWidth)) {
      maxValues.push(maxWidth as number)
    }
    if (Number.isFinite(maxWidthRatio)) {
      maxValues.push(Math.floor(window.innerWidth * (maxWidthRatio as number)))
    }

    const candidateMax = maxValues.length
      ? Math.min(...maxValues)
      : window.innerWidth

    computedMaxWidth = Math.max(minWidth, candidateMax)
    width = clampWidth(width)
  }

  const loadWidth = () => {
    if (!storageKey) {
      width = clampWidth(defaultWidth)
      return
    }

    const saved = localStorage.getItem(storageKey)
    if (!saved) {
      width = clampWidth(defaultWidth)
      return
    }

    const parsedWidth = parseInt(saved, 10)
    if (!Number.isFinite(parsedWidth)) {
      width = clampWidth(defaultWidth)
      return
    }

    width = clampWidth(parsedWidth)
  }

  const [resizable, resizableHandle] = getHorizontalResizeActions(
    defaultWidth,
    nextWidth => {
      if (!Number.isFinite(nextWidth)) {
        return
      }
      const clampedWidth = clampWidth(nextWidth)
      width = clampedWidth
      if (storageKey) {
        localStorage.setItem(storageKey, clampedWidth.toString())
      }
    },
    onResizeStart,
    position
  )

  onMount(() => {
    updateMaxWidth()
    loadWidth()
    window.addEventListener("resize", updateMaxWidth)
  })

  onDestroy(() => {
    window.removeEventListener("resize", updateMaxWidth)
  })
</script>

<div
  class="resizable-panel"
  class:resizing-panel={$builderStore.isResizingPanel}
  style="width: {width}px; min-width: {minWidth}px; max-width: {computedMaxWidth}px;"
  use:resizable
>
  {#if position === "right"}
    <div class="divider">
      <div class="divider-hitbox" role="separator" use:resizableHandle></div>
    </div>
  {/if}

  <div class="content">
    <slot />
  </div>

  {#if position === "left"}
    <div class="divider">
      <div class="divider-hitbox" role="separator" use:resizableHandle></div>
    </div>
  {/if}
</div>

<style>
  .resizable-panel {
    display: flex;
    height: 100%;
    overflow: visible;
    transition: width 300ms ease-out;
  }
  .content {
    flex: 1 1 auto;
    min-width: 0;
    height: 100%;
    display: flex;
  }
  .divider {
    position: relative;
    height: 100%;
    width: 2px;
    min-width: 2px;
    flex-shrink: 0;
    background: var(--spectrum-global-color-gray-200);
    transition: background 130ms ease-out;
    z-index: 1;
  }
  .divider:hover {
    background: var(--spectrum-global-color-gray-300);
    cursor: col-resize;
  }
  .divider-hitbox {
    position: absolute;
    height: 100%;
    width: 12px;
    left: -5px;
    top: 0;
    cursor: col-resize;
  }
  .resizable-panel.resizing-panel {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
</style>

<script lang="ts">
  import { onDestroy, setContext } from "svelte"
  import { writable } from "svelte/store"
  import { Icon } from "@budibase/bbui"
  import { builderStore } from "@/stores/builder"
  import ResizablePanel from "@/components/common/ResizablePanel.svelte"

  const STORAGE_KEY = "design-screens-panel-pinned"
  const PANEL_WIDTH_KEY = "design-screens-panel-width"
  const CLOSE_DURATION_MS = 320
  const PANEL_TRANSITION = "max-width 320ms ease-in-out"

  let pinned = (() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved !== null ? saved === "true" : true
  })()
  let hovered = false
  let isClosing = false
  let closeTimer: ReturnType<typeof setTimeout> | undefined
  let previousShowPanel: boolean | undefined
  let panelWidth = (() => {
    const saved = localStorage.getItem(PANEL_WIDTH_KEY)
    const parsed = saved ? parseInt(saved, 10) : NaN
    const value = Number.isFinite(parsed) ? parsed : 310
    return Math.max(value, 260)
  })()

  const pinnedStore = writable(true)
  $: pinnedStore.set(pinned)

  $: open = pinned || hovered
  $: showPanel = open
  $: panelTransition = PANEL_TRANSITION

  $: {
    if (previousShowPanel === undefined) {
      previousShowPanel = showPanel
      isClosing = false
    } else if (showPanel !== previousShowPanel) {
      previousShowPanel = showPanel
      if (showPanel) {
        isClosing = false
        if (closeTimer) {
          clearTimeout(closeTimer)
          closeTimer = undefined
        }
      } else {
        if (closeTimer) {
          clearTimeout(closeTimer)
        }
        isClosing = true
        closeTimer = setTimeout(() => {
          isClosing = false
          closeTimer = undefined
        }, CLOSE_DURATION_MS)
      }
    }
  }

  const handleResizeStart = () => {}

  const toggle = () => {
    pinned = !pinned
    localStorage.setItem(STORAGE_KEY, pinned.toString())
  }

  setContext("toggleScreenPanel", toggle)
  setContext("screenPanelPinned", pinnedStore)

  onDestroy(() => {
    if (closeTimer) {
      clearTimeout(closeTimer)
    }
  })
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="wrapper"
  on:mouseenter={() => {
    if (!pinned) hovered = true
  }}
  on:mouseleave={() => {
    hovered = false
  }}
>
  <div
    class="panel"
    class:open={showPanel}
    class:resizing={$builderStore.isResizingPanel}
    style="--open-width: {panelWidth}px; --panel-transition: {panelTransition}"
  >
    <ResizablePanel
      storageKey={PANEL_WIDTH_KEY}
      defaultWidth={310}
      minWidth={260}
      maxWidthRatio={0.4}
      position="left"
      onResizeStart={handleResizeStart}
    >
      <slot />
    </ResizablePanel>
  </div>
  <div class="hover-hitbox" class:hidden={showPanel || isClosing}></div>
  <button
    class="reopen-btn"
    class:hidden={(showPanel && !hovered) || isClosing}
    on:click={toggle}
    title="Pin panel open"
  >
    <span class="icon-rotated" aria-hidden="true">
      <Icon
        name="sidebar-simple"
        size="M"
        color="var(--spectrum-global-color-gray-700)"
      />
    </span>
    <span class="reopen-label">Screens</span>
  </button>
</div>

<style>
  .wrapper {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    height: 100%;
  }
  .hover-hitbox {
    position: absolute;
    top: 0;
    right: 0;
    width: 14px;
    height: 100%;
    background: transparent;
    transform: translateX(100%);
  }
  .hover-hitbox.hidden {
    display: none;
  }
  .panel {
    display: flex;
    flex-direction: row;
    height: 100%;
    max-width: 0;
    background: var(--background);
    overflow: clip;
    transition: var(--panel-transition);
    will-change: max-width;
    contain: layout paint;
  }
  .panel.resizing {
    transition: none;
  }
  .panel.resizing.open {
    max-width: none;
  }
  .panel.open {
    max-width: var(--open-width, 310px);
    border-right: 1px solid var(--spectrum-global-color-gray-200);
    border-left: 1px solid var(--spectrum-global-color-gray-200);
  }
  .reopen-btn {
    flex: 0 0 36px;
    width: 36px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 12px;
    border: none;
    border-left: 1px solid var(--spectrum-global-color-gray-200);
    border-right: 1px solid var(--spectrum-global-color-gray-200);
    background: var(--background-alt);
    cursor: pointer;
    color: var(--spectrum-global-color-gray-700);
    overflow: hidden;
    transition:
      flex 160ms cubic-bezier(0.22, 1, 0.36, 1),
      width 160ms cubic-bezier(0.22, 1, 0.36, 1);
  }
  .reopen-btn.hidden {
    flex: 0 0 0px;
    width: 0;
    padding: 0;
    border: none;
    opacity: 0;
    pointer-events: none;
  }
  .reopen-btn:not(.hidden):hover {
    background: var(--spectrum-global-color-gray-200);
  }
  .reopen-label {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
    font-size: 12px;
    font-weight: 500;
    color: var(--spectrum-global-color-gray-700);
    white-space: nowrap;
    letter-spacing: 1px;
    margin-top: 6px;
  }
  /* Keep the icon orientation natural for the left-side rail. */
  .icon-rotated {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
</style>

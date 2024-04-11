<script>
  import { getContext } from "svelte"

  const component = getContext("component")
  const { styleable, sidePanelStore, builderStore, dndIsDragging } =
    getContext("sdk")

  let handlingSidePanelOpen
  let handlingSidePanelClose

  export let sidePanelOpen
  export let sidePanelClose
  export let clickOutsideToClose

  // Automatically show and hide the side panel when inside the builder.
  // For some unknown reason, svelte reactivity breaks if we reference the
  // reactive variable "open" inside the following expression, or if we define
  // "open" above this expression.
  $: {
    if ($builderStore.inBuilder) {
      if (
        $component.inSelectedPath &&
        $sidePanelStore.contentId !== $component.id
      ) {
        sidePanelStore.actions.open($component.id)
      } else if (
        !$component.inSelectedPath &&
        $sidePanelStore.contentId === $component.id &&
        !$dndIsDragging
      ) {
        sidePanelStore.actions.close()
      }
    }
  }

  $: {
    sidePanelStore.actions.setSidepanelState(clickOutsideToClose)
  }

  // Derive visibility
  $: open = $sidePanelStore.contentId === $component.id

  // Derive a render key which is only changed whenever this panel is made
  // visible after being hidden. We need to key the content to avoid showing
  // stale data when re-revealing a side panel that was closed, but we cannot
  // hide the content altogether when hidden as this breaks ejection.
  let renderKey = null
  $: {
    if (open) {
      renderKey = Math.random()
    }
  }

  const handleSidePanelOpen = async () => {
    handlingSidePanelOpen = true
    if (sidePanelOpen) {
      await sidePanelOpen()
    }
    handlingSidePanelOpen = false
  }

  const handleSidePanelClose = async () => {
    handlingSidePanelClose = true
    if (sidePanelClose) {
      await sidePanelClose()
    }
    handlingSidePanelOpen = false
  }

  const showInSidePanel = (el, visible) => {
    const update = visible => {
      const target = document.getElementById("side-panel-container")
      const node = el
      if (visible) {
        if (!target.contains(node)) {
          target.appendChild(node)
          handleSidePanelOpen()
        }
      } else {
        if (target.contains(node)) {
          target.removeChild(node)
          handleSidePanelClose()
        }
      }
    }

    // Apply initial visibility
    update(visible)

    return {
      update,
      destroy: () => update(false),
    }
  }
</script>

<div
  use:styleable={$component.styles}
  use:showInSidePanel={open}
  class="side-panel"
  class:open
>
  {#key renderKey}
    <slot />
  {/key}
</div>

<style>
  .side-panel {
    flex: 1 1 auto;
    display: none;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-xl);
  }
  .side-panel.open {
    display: flex;
  }
  .side-panel :global(.component > *) {
    max-width: 100%;
  }
</style>

<script>
  import { getContext, onDestroy } from "svelte"

  const component = getContext("component")
  const { styleable, sidePanelStore, builderStore, dndIsDragging } =
    getContext("sdk")

  let renderContent = false
  let contentTimeout

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

  // Derive visibility
  $: open = $sidePanelStore.contentId === $component.id

  // When we hide the side panel we want to kick off a short timeout which will
  // eventually hide the content. We don't do this immediately as this causes
  // things like cycling through a table to constantly remount the side panel
  // contents.
  $: updateContentVisibility(open)
  const updateContentVisibility = open => {
    clearTimeout(contentTimeout)
    contentTimeout = setTimeout(() => {
      renderContent = open
    }, 130)
  }

  const showInSidePanel = (el, visible) => {
    const update = visible => {
      const target = document.getElementById("side-panel-container")
      const node = el
      if (visible) {
        if (!target.contains(node)) {
          target.appendChild(node)
        }
      } else {
        if (target.contains(node)) {
          target.removeChild(node)
        }
      }
    }

    // Apply initial visibility
    update(visible)

    return { update }
  }

  onDestroy(() => {
    clearTimeout(contentTimeout)
  })
</script>

<div
  use:styleable={$component.styles}
  use:showInSidePanel={open}
  class="side-panel"
  class:open
>
  {#if renderContent}
    <slot />
  {/if}
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

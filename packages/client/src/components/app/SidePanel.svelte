<script>
  import { getContext } from "svelte"

  const component = getContext("component")
  const { styleable, sidePanelStore, builderStore, dndIsDragging } =
    getContext("sdk")

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
  $: open = $sidePanelStore.contentId === $component.id

  const showInSidePanel = (el, visible) => {
    const target = document.getElementById("side-panel-container")
    const node = el.parentNode
    const destroy = () => {
      if (target.contains(node)) {
        target.removeChild(node)
      }
    }
    const update = visible => {
      if (visible) {
        if (!target.contains(node)) {
          target.appendChild(node)
        }
        el.hidden = false
      } else {
        destroy()
        el.hidden = true
      }
    }

    // Apply initial visibility
    update(visible)

    return {
      update,
      destroy,
    }
  }
</script>

<div
  use:styleable={$component.styles}
  use:showInSidePanel={open}
  hidden
  class="side-panel"
>
  <slot />
</div>

<style>
  .side-panel {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-xl);
  }
  .side-panel :global(.component > *) {
    max-width: 100%;
  }
</style>

<script>
  import { getContext } from "svelte"

  const component = getContext("component")
  const { styleable, sidePanelStore, builderStore } = getContext("sdk")

  $: open = $sidePanelStore.contentId === $component.id

  // Automatically show and hide the side panel when inside the builder
  $: {
    if ($builderStore.inBuilder) {
      if ($component.inSelectedPath && !open) {
        sidePanelStore.actions.open($component.id)
      } else if (!$component.inSelectedPath && open) {
        sidePanelStore.actions.close()
      }
    }
  }

  const showInSidePanel = (el, visible) => {
    const target = document.getElementById("side-panel-container")
    const destroy = () => {
      el.parentNode?.removeChild(el)
    }
    const update = visible => {
      if (visible) {
        target.appendChild(el)
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
</style>

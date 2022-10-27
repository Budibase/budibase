<script>
  import { getContext } from "svelte"

  const component = getContext("component")
  const { styleable, sidePanelStore } = getContext("sdk")

  $: open = $sidePanelStore.contentId === $component.id

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
<div>
  <button on:click={() => sidePanelStore.actions.open($component.id)}
    >open</button
  >
  <button on:click={sidePanelStore.actions.close}>close</button>
</div>

<style>
  .side-panel {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-xl);
  }
</style>

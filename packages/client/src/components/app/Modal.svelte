<script>
  import { getContext } from "svelte"

  const component = getContext("component")
  const { styleable, modalStore, builderStore, dndIsDragging } =
    getContext("sdk")

  export let onClose
  export let ignoreClicksOutside

  // Automatically show and hide the side panel when inside the builder.
  // For some unknown reason, svelte reactivity breaks if we reference the
  // reactive variable "open" inside the following expression, or if we define
  // "open" above this expression.
  $: {
    if ($builderStore.inBuilder) {
      if (
        $component.inSelectedPath &&
        $modalStore.contentId !== $component.id
      ) {
        modalStore.actions.open($component.id)
      } else if (
        !$component.inSelectedPath &&
        $modalStore.contentId === $component.id &&
        !$dndIsDragging
      ) {
        modalStore.actions.close()
      }
    }
  }

  // $: {

  // }

  // Derive visibility
  $: open = $modalStore.contentId === $component.id

  // Derive a render key which is only changed whenever this panel is made
  // visible after being hidden. We need to key the content to avoid showing
  // stale data when re-revealing a side panel that was closed, but we cannot
  // hide the content altogether when hidden as this breaks ejection.
  let renderKey = null
  $: {
    if (open) {
      modalStore.actions.setIgnoreClicksOutside(ignoreClicksOutside)
      renderKey = Math.random()
    }
  }

  const handleModalClose = async () => {
    if (onClose) {
      await onClose()
    }
  }

  const showInModal = (el, visible) => {
    const update = visible => {
      const target = document.getElementById("modal-container")
      const node = el
      if (visible) {
        if (!target.contains(node)) {
          target.appendChild(node)
        }
      } else {
        if (target.contains(node)) {
          target.removeChild(node)
          handleModalClose()
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
  use:showInModal={open}
  class="modal"
  class:open
>
  {#key renderKey}
    <slot />
  {/key}
</div>

<style>
  .modal {
    flex: 1 1 auto;
    display: none;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-xl);
  }
  .modal.open {
    display: flex;
  }
  .modal :global(.component > *) {
    max-width: 100%;
  }
</style>

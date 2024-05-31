<script>
  import { getContext } from "svelte"
  import { Icon } from "@budibase/bbui"

  const component = getContext("component")
  const { styleable, modalStore, builderStore, dndIsDragging } =
    getContext("sdk")

  export let onClose
  export let ignoreClicksOutside
  export let size

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
  class="modal {size}"
  class:open
>
  <div class="modal-header">
    <Icon
      color="var(--spectrum-global-color-gray-600)"
      name="Close"
      hoverable
      on:click={modalStore.actions.close}
    />
  </div>
  <div
    class="modal-main"
  >
    {#key renderKey}
      <slot />
    {/key}
  </div>
</div>

<style>
  .modal {
    background-color: var(--background);
    display: flex;
    flex-direction: column;
    padding: 12px 0px 40px;
    border-radius: 8px;
    box-sizing: border-box;
    max-width: 100%;
  }

  .modal.small {
    width: 400px;
    min-height: 200px;
  }

  .modal.medium {
    width: 600px;
    min-height: 400px;
  }

  .modal.large {
    width: 800px;
    min-height: 600px;
  }

  .modal.fullscreen {
    width: 100%;
    min-height: 100%;
  }

  .modal-header {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    flex-shrink: 0;
    flex-grow: 0;
    padding: 0 12px 12px;
    box-sizing: border-box;
  }

  .modal-main {
    padding: 0 40px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    word-break: break-word;
  }

  .modal-main :global(.component > *) {
    max-width: 100%;
  }

</style>

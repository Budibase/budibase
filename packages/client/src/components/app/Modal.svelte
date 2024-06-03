<script>
  import { getContext } from "svelte"
  import { clickOutside, Icon } from "@budibase/bbui"
  import Portal from "svelte-portal"

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

  $: autoCloseModal =
    !$builderStore.inBuilder &&
    $modalStore.open &&
    !$modalStore.ignoreClicksOutside
</script>

{#if open}
  <Portal target=".modal-portal">
    <div
      class="modal-scroll-container"
      class:open={$modalStore.open}
    >
      <div
        class="modal-container"
      >
        <div
          use:styleable={$component.styles}
          use:clickOutside={autoCloseModal ? modalStore.actions.close : null}
          class="modal {size}"
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
              <slot />
          </div>
        </div>
      </div>
    </div>
  </Portal>
{/if}

<style>
  .modal-scroll-container {
    background-color: #00000078;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow-y: scroll;
    position: absolute;
    display: block;
    z-index: 3;
  }

  .modal-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 100vh;
    padding: 20px 20px 20px;
    box-sizing: border-box;
  }

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
    min-height: calc(100vh - 40px);
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

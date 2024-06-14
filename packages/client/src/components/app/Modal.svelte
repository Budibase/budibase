<script>
  import { fade, fly } from "svelte/transition"
  import { getContext } from "svelte"
  import { clickOutside, Icon } from "@budibase/bbui"
  import Portal from "svelte-portal"

  const component = getContext("component")
  const { styleable, modalStore, builderStore, dndIsDragging } =
    getContext("sdk")

  export let onClose
  export let ignoreClicksOutside
  export let size

  // Open modal automatically in builder
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

  $: open = $modalStore.contentId === $component.id

  const handleModalClose = async () => {
    if (onClose) {
      await onClose()
    }
    modalStore.actions.close()
  }
</script>

{#if open}
  <Portal target=".modal-portal">
    <div
      transition:fade={{ duration: 300 }}
      class="modal-scroll-container"
      class:open={$modalStore.open}
    >
      <div class="modal-container">
        <div
          transition:fly={{ duration: 300, y: 300 }}
          use:styleable={$component.styles}
          use:clickOutside={!ignoreClicksOutside ? handleModalClose : null}
          class="modal {size}"
        >
          <div class="modal-header">
            <Icon
              color="var(--spectrum-global-color-gray-600)"
              name="Close"
              hoverable
              on:click={handleModalClose}
            />
          </div>
          <div class="modal-main">
            <div class="modal-main-inner">
              <slot />
            </div>
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
    overflow: auto;
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
    background-color: var(--spectrum-global-color-gray-50);
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
  }

  .modal-main :global(.component > *) {
    max-width: 100%;
  }

  .modal-main-inner {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    word-break: break-word;
  }

  .modal-main-inner:empty {
    border-radius: 3px;
    border: 2px dashed var(--spectrum-global-color-gray-400);
  }
</style>

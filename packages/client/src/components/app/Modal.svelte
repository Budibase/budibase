<script>
  import { getContext } from "svelte"
  import { Modal, Icon } from "@budibase/bbui"

  const component = getContext("component")
  const { styleable, modalStore, builderStore, dndIsDragging } =
    getContext("sdk")

  export let onClose
  export let ignoreClicksOutside
  export let size
  let modal

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

  const handleOpen = (open, modal) => {
    if (!modal) return

    if (open) {
      modal.show()
    } else {
      modal.hide()
    }
  }

  $: handleOpen(open, modal)
</script>

<!-- Conditional displaying in the builder is necessary otherwise previews don't update properly upon component deletion -->
{#if !$builderStore.inBuilder || open}
  <Modal
    on:cancel={handleModalClose}
    bind:this={modal}
    disableCancel={$builderStore.inBuilder || ignoreClicksOutside}
    zIndex={2}
  >
    <div use:styleable={$component.styles} class={`modal-content ${size}`}>
      <div class="modal-header">
        <Icon
          color="var(--spectrum-global-color-gray-800)"
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
  </Modal>
{/if}

<style>
  .modal-content {
    display: flex;
    flex-direction: column;
    max-width: 100%;
    box-sizing: border-box;
    padding: 12px 0px 40px;
  }

  .small {
    width: 400px;
    min-height: 200px;
  }

  .medium {
    width: 600px;
    min-height: 400px;
  }

  .large {
    width: 800px;
    min-height: 600px;
  }

  .fullscreen {
    width: calc(100vw - 80px);
    min-height: calc(100vh - 80px);
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

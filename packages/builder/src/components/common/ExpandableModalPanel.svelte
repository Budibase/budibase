<script lang="ts">
  import {
    ActionButton,
    Divider,
    Icon,
    Modal,
    ModalContent,
  } from "@budibase/bbui"

  type ModalSize = "S" | "M" | "L" | "XL"

  export let title = "Details"
  export let modalSize: ModalSize = "XL"
  export let modalHeight = "70vh"

  let modal: Modal | undefined
  let expanded = false

  const open = () => {
    expanded = true
    modal?.show()
  }

  const close = () => {
    expanded = false
    modal?.hide()
  }
</script>

<div class="expandable-panel">
  <div class="panel-header">
    <div class="header-content">
      <slot name="header" />
    </div>
    <div class="toggle-button">
      <ActionButton quiet on:click={open}>
        <Icon name="arrows-out-simple" size="S" />
      </ActionButton>
    </div>
  </div>
  <Divider noMargin />
  {#if !expanded}
    <div class="panel-content">
      <slot name="content" />
    </div>
  {/if}
</div>

<Modal bind:this={modal} on:hide={() => (expanded = false)}>
  <ModalContent
    {title}
    size={modalSize}
    showConfirmButton={false}
    showCancelButton={false}
  >
    {#if expanded}
      <div class="modal-wrap" style={`--modal-height: ${modalHeight}`}>
        <div class="panel-header">
          <div class="header-content">
            <slot name="header" />
          </div>
          <div class="toggle-button">
            <ActionButton quiet on:click={close}>
              <Icon name="arrows-in-simple" size="S" />
            </ActionButton>
          </div>
        </div>
        <Divider noMargin />
        <div class="panel-content">
          <slot name="content" />
        </div>
      </div>
    {/if}
  </ModalContent>
</Modal>

<style>
  .expandable-panel,
  .modal-wrap {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .modal-wrap {
    height: var(--modal-height);
  }

  .panel-header {
    display: flex;
    align-items: center;
    min-height: 0;
  }

  .header-content {
    flex: 1;
    min-width: 0;
    min-height: 0;
  }

  .panel-content {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .toggle-button {
    margin-right: var(--spacing-l);
  }
</style>

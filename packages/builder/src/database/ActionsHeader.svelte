<script>
  import Button from "../common/Button.svelte"
  import ActionButton from "../common/ActionButton.svelte"
  import ButtonGroup from "../common/ButtonGroup.svelte"
  import { store } from "../builderStore"
  import Modal from "../common/Modal.svelte"
  import ErrorsBox from "../common/ErrorsBox.svelte"

  export let left
  let confirmDelete = false
  const openConfirmDelete = () => {
    confirmDelete = true
  }

  const deleteCurrentNode = () => {
    confirmDelete = false
    store.deleteCurrentNode()
  }
</script>

<div class="root" style="left: {left}">

  <ButtonGroup>
    <ActionButton color="secondary" grouped on:click={store.saveCurrentNode}>
      {#if $store.currentNodeIsNew}Create{:else}Update{/if}
    </ActionButton>

    {#if !$store.currentNodeIsNew}
      <ActionButton alert grouped on:click={openConfirmDelete}>
        Delete
      </ActionButton>
    {/if}
  </ButtonGroup>

  {#if !!$store.errors && $store.errors.length > 0}
    <div style="width: 500px">
      <ErrorsBox errors={$store.errors} />
    </div>
  {/if}

  <Modal onClosed={() => (confirmDelete = false)} bind:isOpen={confirmDelete}>
    <span>
      Are you sure you want to delete {$store.currentNode.name}?
    </span>
    <div class="uk-modal-footer uk-text-right">
      <ButtonGroup>
        <ActionButton alert on:click={deleteCurrentNode}>Yes</ActionButton>
        <ActionButton primary on:click={() => (confirmDelete = false)}>
          No
        </ActionButton>
      </ButtonGroup>
    </div>
  </Modal>
</div>

<style>
  .root {
    padding: 1.5rem;
    width: 100%;
    align-items: right;
  }

  .actions-modal-body {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

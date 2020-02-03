<script>
  import Button from "../common/Button.svelte"
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
    <Button color="secondary" grouped on:click={store.saveCurrentNode}>
      {#if $store.currentNodeIsNew}Create{:else}Update{/if}
    </Button>

    {#if !$store.currentNodeIsNew}
      <Button color="tertiary" grouped on:click={openConfirmDelete}>
        Delete
      </Button>
    {/if}
  </ButtonGroup>

  {#if !!$store.errors && $store.errors.length > 0}
    <div style="width: 500px">
      <ErrorsBox errors={$store.errors} />
    </div>
  {/if}

  <Modal bind:isOpen={confirmDelete}>
    <div style="margin: 10px 0px 20px 0px">
      Are you sure you want to delete {$store.currentNode.name} ?
    </div>
    <div style="float:right">
      <Button color="primary" on:click={deleteCurrentNode}>Yes</Button>
      <Button color="secondary" on:click={() => (confirmDelete = false)}>
        No
      </Button>
    </div>
  </Modal>
</div>

<style>
  .root {
    padding: 1.5rem;
    width: 100%;
    align-items: right;
  }
</style>

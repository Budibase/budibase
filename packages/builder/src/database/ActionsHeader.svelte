<script>
  import Button from "../common/Button.svelte"
  import ActionButton from "../common/ActionButton.svelte"
  import ButtonGroup from "../common/ButtonGroup.svelte"
  import { store } from "../builderStore"
  import Modal from "../common/Modal.svelte"
  import ErrorsBox from "../common/ErrorsBox.svelte"

  let confirmDelete = false

  const openConfirmDelete = () => {
    confirmDelete = true
  }

  const deleteCurrentNode = () => {
    confirmDelete = false
    store.deleteCurrentNode()
  }
</script>

<div class="root">
  <div class="button-container">
    {#if !$store.currentNodeIsNew}
      <ActionButton alert on:click={deleteCurrentNode}>
        Delete
      </ActionButton>
    {/if}

    <ActionButton color="secondary" on:click={store.saveCurrentNode}>
      Save
    </ActionButton>
  </div>

  {#if $store.errors && $store.errors.length > 0}
    <ErrorsBox errors={$store.errors} />
  {/if}
</div>

<style>
  .root {
    display: flex;
    background: #fafafa;
    width: 100%;
    border-top: 1px solid #ccc;
  }

  .button-container {
    padding: 20px;
  }
</style>

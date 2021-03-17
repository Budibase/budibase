<script>
  import { goto } from "@roxi/routify"
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import { DropdownMenu, Button, Input } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { DropdownContainer, DropdownItem } from "components/common/Dropdowns"

  export let view

  let anchor
  let dropdown
  let editing
  let originalName = view.name
  let confirmDeleteDialog

  function showEditor() {
    editing = true
  }

  function hideEditor() {
    dropdown.hide()
    editing = false
  }

  function showDelete() {
    dropdown.hide()
    confirmDeleteDialog.show()
  }

  async function save() {
    await backendUiStore.actions.views.save({
      originalName,
      ...view,
    })
    notifier.success("View renamed successfully")
    hideEditor()
  }

  async function deleteView() {
    const name = view.name
    const id = view.tableId
    await backendUiStore.actions.views.delete(name)
    notifier.success("View deleted")
    $goto(`./table/${id}`)
  }
</script>

<div on:click|stopPropagation>
  <div bind:this={anchor} class="icon" on:click={dropdown.show}>
    <i class="ri-more-line" />
  </div>
  <DropdownMenu align="left" {anchor} bind:this={dropdown}>
    {#if editing}
      <div class="actions">
        <h5>Edit View</h5>
        <Input label="View Name" thin bind:value={view.name} />
        <footer>
          <Button secondary on:click={hideEditor}>Cancel</Button>
          <Button primary on:click={save}>Save</Button>
        </footer>
      </div>
    {:else}
      <DropdownContainer>
        <DropdownItem
          icon="ri-edit-line"
          data-cy="edit-view"
          title="Edit"
          on:click={showEditor} />
        <DropdownItem
          icon="ri-delete-bin-line"
          title="Delete"
          data-cy="delete-view"
          on:click={showDelete} />
      </DropdownContainer>
    {/if}
  </DropdownMenu>
</div>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  body={`Are you sure you wish to delete the view '${view.name}'? Your data will be deleted and this action cannot be undone.`}
  okText="Delete View"
  onOk={deleteView}
  title="Confirm Deletion" />

<style>
  div.icon {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }

  div.icon i {
    font-size: 16px;
  }

  .actions {
    padding: var(--spacing-xl);
    display: grid;
    grid-gap: var(--spacing-xl);
    min-width: 400px;
  }

  h5 {
    margin: 0;
    font-weight: 500;
  }

  footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-m);
  }
</style>

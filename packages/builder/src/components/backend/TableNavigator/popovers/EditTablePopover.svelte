<script>
  import { goto } from "@roxi/routify"
  import { backendUiStore, store, allScreens } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import { DropdownMenu, Button, Input } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { DropdownContainer, DropdownItem } from "components/common/Dropdowns"

  export let table

  let anchor
  let dropdown
  let editing
  let confirmDeleteDialog
  let error = ""
  let originalName = table.name
  let templateScreens
  let willBeDeleted

  function showEditor() {
    editing = true
  }

  function hideEditor() {
    dropdown?.hide()
    editing = false
  }

  function showModal() {
    const screens = $allScreens
    templateScreens = screens.filter(screen => screen.autoTableId === table._id)
    willBeDeleted = ["All table data"].concat(
      templateScreens.map(screen => `Screen ${screen.props._instanceName}`)
    )
    hideEditor()
    confirmDeleteDialog.show()
  }

  async function deleteTable() {
    const wasSelectedTable = $backendUiStore.selectedTable
    await backendUiStore.actions.tables.delete(table)
    store.actions.screens.delete(templateScreens)
    await backendUiStore.actions.tables.fetch()
    notifier.success("Table deleted")
    if (wasSelectedTable._id === table._id) {
      $goto("./table")
    }
    hideEditor()
  }

  async function save() {
    await backendUiStore.actions.tables.save(table)
    notifier.success("Table renamed successfully")
    hideEditor()
  }

  function checkValid(evt) {
    const tableName = evt.target.value
    if (
      originalName !== tableName &&
      $backendUiStore.models?.some(model => model.name === tableName)
    ) {
      error = `Table with name ${tableName} already exists. Please choose another name.`
      return
    }
    error = ""
  }
</script>

<div on:click|stopPropagation>
  <div bind:this={anchor} class="icon" on:click={dropdown.show}>
    <i class="ri-more-line" />
  </div>
  <DropdownMenu align="left" {anchor} bind:this={dropdown}>
    {#if editing}
      <div class="actions">
        <h5>Edit Table</h5>
        <Input
          label="Table Name"
          thin
          bind:value={table.name}
          on:input={checkValid}
          {error} />
        <footer>
          <Button secondary on:click={hideEditor}>Cancel</Button>
          <Button primary disabled={error} on:click={save}>Save</Button>
        </footer>
      </div>
    {:else}
      <DropdownContainer>
        <DropdownItem
          icon="ri-edit-line"
          data-cy="edit-table"
          title="Edit"
          on:click={showEditor} />
        <DropdownItem
          icon="ri-delete-bin-line"
          title="Delete"
          on:click={showModal}
          data-cy="delete-table" />
      </DropdownContainer>
    {/if}
  </DropdownMenu>
</div>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText="Delete Table"
  onOk={deleteTable}
  title="Confirm Deletion">
  Are you sure you wish to delete the table
  <i>{table.name}?</i>
  The following will also be deleted:
  <b>
    <div class="delete-items">
      {#each willBeDeleted as item}
        <div>{item}</div>
      {/each}
    </div>
  </b>
  This action cannot be undone.
</ConfirmDialog>

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

  div.delete-items {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 10px;
  }

  div.delete-items div {
    margin-top: 4px;
    font-weight: 500;
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

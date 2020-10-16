<script>
  import { backendUiStore, store } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import { DropdownMenu, Button, Icon, Input, Select } from "@budibase/bbui"
  import { FIELDS } from "constants/backend"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import screenTemplates from "builderStore/store/screenTemplates"
  import api from "builderStore/api"

  export let table

  let anchor
  let dropdown
  let editing
  let confirmDeleteDialog
  let error = ""
  let originalName = table.name
  let templateScreens
  let willBeDeleted

  $: fields = Object.keys(table.schema)

  function showEditor() {
    editing = true
  }

  function hideEditor() {
    dropdown?.hide()
    editing = false
  }

  function showModal() {
    const screens = $store.screens
    templateScreens = screens.filter(screen => screen.autoTableId === table._id)
    willBeDeleted = ["All table data"].concat(
      templateScreens.map(screen => `Screen ${screen.props._instanceName}`)
    )
    hideEditor()
    confirmDeleteDialog.show()
  }

  async function deleteTable() {
    await backendUiStore.actions.tables.delete(table)
    store.deleteScreens(templateScreens)
    await backendUiStore.actions.tables.fetch()
    notifier.success("Table deleted")
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
    <ul>
      <li on:click={showEditor}>
        <Icon name="edit" />
        Edit
      </li>
      <li data-cy="delete-table" on:click={showModal}>
        <Icon name="delete" />
        Delete
      </li>
    </ul>
  {/if}
</DropdownMenu>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText="Delete Table"
  onOk={deleteTable}
  title="Confirm Delete">
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

  ul {
    list-style: none;
    margin: 0;
    padding: var(--spacing-s) 0;
  }

  li {
    display: flex;
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    color: var(--ink);
    padding: var(--spacing-s) var(--spacing-m);
    margin: auto 0px;
    align-items: center;
    cursor: pointer;
  }

  li:hover {
    background-color: var(--grey-2);
  }

  li:active {
    color: var(--blue);
  }
</style>

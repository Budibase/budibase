<script>
  import { goto } from "@roxi/routify"
  import { store, allScreens } from "builderStore"
  import { tables } from "stores/backend"
  import { notifications } from "@budibase/bbui"
  import {
    ActionMenu,
    MenuItem,
    Icon,
    Modal,
    ModalContent,
    Popover,
    Button,
    Input,
  } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"

  export let table

  let anchor
  let editorModal
  let dropdown
  let confirmDeleteDialog
  let error = ""
  let originalName = table.name
  let templateScreens
  let willBeDeleted

  function showEditor() {
    editorModal.show()
    dropdown?.hide()
  }

  function hideEditor() {
    editorModal.hide()
    dropdown?.hide()
  }

  function showDeleteModal() {
    const screens = $allScreens
    templateScreens = screens.filter(
      (screen) => screen.autoTableId === table._id
    )
    willBeDeleted = ["All table data"].concat(
      templateScreens.map((screen) => `Screen ${screen.props._instanceName}`)
    )
    hideEditor()
    confirmDeleteDialog.show()
  }

  async function deleteTable() {
    const wasSelectedTable = $tables.selected
    await tables.delete(table)
    store.actions.screens.delete(templateScreens)
    await tables.fetch()
    notifications.success("Table deleted")
    if (wasSelectedTable._id === table._id) {
      $goto("./table")
    }
    hideEditor()
  }

  async function save() {
    await tables.save(table)
    notifications.success("Table renamed successfully")
    hideEditor()
  }

  function checkValid(evt) {
    const tableName = evt.target.value
    error =
      originalName === tableName
        ? `Table with name ${tableName} already exists. Please choose another name.`
        : ""
  }
</script>

<ActionMenu bind:this={dropdown}>
  <div slot="button" class="icon" on:click={dropdown.show}>
    <Icon s hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Edit" on:click={showEditor}>Edit</MenuItem>
  <MenuItem icon="Delete" on:click={showDeleteModal}>Delete</MenuItem>
</ActionMenu>

<Modal bind:this={editorModal}>
  <ModalContent
    title='Edit Table'
    confirmText='Save'
    onConfirm={save}
    disabled={table.name === originalName || error}>
    <Input
      label="Table Name"
      thin
      bind:value={table.name}
      on:input={checkValid}
      {error}
    />
  </ModalContent>
</Modal>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText="Delete Table"
  onOk={deleteTable}
  title="Confirm Deletion"
>
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

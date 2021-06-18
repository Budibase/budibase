<script>
  import {goto} from "@roxi/routify"
  import {allScreens, store} from "builderStore"
  import {tables} from "stores/backend"
  import {ActionMenu, Icon, Input, MenuItem, Modal, ModalContent, notifications} from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"

  export let table

  let editorModal
  let confirmDeleteDialog
  let error = ""
  let originalName = table.name
  let templateScreens
  let willBeDeleted

  $: external = table?.type === "external"

  function showDeleteModal() {
    templateScreens = $allScreens.filter(screen => screen.autoTableId === table._id)
    willBeDeleted = ["All table data"].concat(
      templateScreens.map(screen => `Screen ${screen.props._instanceName}`)
    )
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
  }

  async function save() {
    await tables.save(table)
    notifications.success("Table renamed successfully")
  }

  function checkValid(evt) {
    const tableName = evt.target.value
    error =
      originalName === tableName
        ? `Table with name ${tableName} already exists. Please choose another name.`
        : ""
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon s hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Edit" on:click={editorModal.show}>Edit</MenuItem>
  {#if !external}
    <MenuItem icon="Delete" on:click={showDeleteModal}>Delete</MenuItem>
  {/if}
</ActionMenu>

<Modal bind:this={editorModal}>
  <ModalContent
    title="Edit Table"
    confirmText="Save"
    onConfirm={save}
    disabled={table.name === originalName || error}
  >
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
    font-weight: 600;
  }
</style>

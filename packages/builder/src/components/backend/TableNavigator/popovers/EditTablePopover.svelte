<script>
  import { goto, params } from "@roxi/routify"
  import { cloneDeep } from "lodash/fp"
  import { tables, datasources, screenStore } from "stores/builder"
  import {
    ActionMenu,
    Icon,
    Input,
    MenuItem,
    Modal,
    ModalContent,
    notifications,
  } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { DB_TYPE_EXTERNAL } from "constants/backend"

  export let table

  let editorModal, editTableNameModal
  let confirmDeleteDialog
  let error = ""

  let originalName
  let updatedName

  let templateScreens
  let willBeDeleted
  let deleteTableName

  $: externalTable = table?.sourceType === DB_TYPE_EXTERNAL
  $: allowDeletion = !externalTable || table?.created

  function showDeleteModal() {
    templateScreens = $screenStore.screens.filter(
      screen => screen.autoTableId === table._id
    )
    willBeDeleted = ["All table data"].concat(
      templateScreens.map(screen => `Screen ${screen.routing?.route || ""}`)
    )
    confirmDeleteDialog.show()
  }

  async function deleteTable() {
    const isSelected = $params.tableId === table._id
    try {
      await tables.delete(table)
      // Screens need deleted one at a time because of undo/redo
      for (let screen of templateScreens) {
        await screenStore.delete(screen)
      }
      if (table.sourceType === DB_TYPE_EXTERNAL) {
        await datasources.fetch()
      }
      notifications.success("Table deleted")
      if (isSelected) {
        $goto(`./datasource/${table.datasourceId}`)
      }
    } catch (error) {
      notifications.error("Error deleting table")
    }
  }

  function hideDeleteDialog() {
    deleteTableName = ""
  }

  async function save() {
    const updatedTable = cloneDeep(table)
    updatedTable.name = updatedName
    await tables.save(updatedTable)
    await datasources.fetch()
    notifications.success("Table renamed successfully")
  }

  function checkValid(evt) {
    const tableName = evt.target.value
    error =
      originalName === tableName
        ? `Table with name ${tableName} already exists. Please choose another name.`
        : ""
  }

  const initForm = () => {
    originalName = table.name + ""
    updatedName = table.name + ""
  }
</script>

{#if allowDeletion}
  <ActionMenu>
    <div slot="control" class="icon">
      <Icon s hoverable name="MoreSmallList" />
    </div>
    {#if !externalTable}
      <MenuItem icon="Edit" on:click={editorModal.show}>Edit</MenuItem>
    {/if}
    <MenuItem icon="Delete" on:click={showDeleteModal}>Delete</MenuItem>
  </ActionMenu>
{/if}

<Modal bind:this={editorModal} on:show={initForm}>
  <ModalContent
    bind:this={editTableNameModal}
    title="Edit Table"
    confirmText="Save"
    onConfirm={save}
    disabled={updatedName === originalName || error}
  >
    <form on:submit|preventDefault={() => editTableNameModal.confirm()}>
      <Input
        label="Table Name"
        thin
        bind:value={updatedName}
        on:input={checkValid}
        {error}
      />
    </form>
  </ModalContent>
</Modal>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText="Delete Table"
  onOk={deleteTable}
  onCancel={hideDeleteDialog}
  title="Confirm Deletion"
  disabled={deleteTableName !== table.name}
>
  <p>
    Are you sure you wish to delete the table
    <b>{table.name}?</b>
    The following will also be deleted:
  </p>
  <b>
    <div class="delete-items">
      {#each willBeDeleted as item}
        <div>{item}</div>
      {/each}
    </div>
  </b>
  <p>
    This action cannot be undone - to continue please enter the table name below
    to confirm.
  </p>
  <Input bind:value={deleteTableName} placeholder={table.name} />
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

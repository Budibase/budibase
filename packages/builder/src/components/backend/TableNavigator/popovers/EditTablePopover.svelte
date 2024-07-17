<script>
  import { goto, params } from "@roxi/routify"
  import { cloneDeep } from "lodash/fp"
  import { appStore, tables, datasources, screenStore } from "stores/builder"
  import {
    ActionMenu,
    Icon,
    Input,
    MenuItem,
    Modal,
    ModalContent,
    notifications,
    Link,
    InlineAlert
  } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import { DB_TYPE_EXTERNAL } from "constants/backend"

  export let table

  let editorModal, editTableNameModal
  let confirmDeleteDialog
  let error = ""

  let originalName
  let updatedName

  let screensPossiblyAffected = []
  let viewsMessage = "";
  let deleteTableName

  $: externalTable = table?.sourceType === DB_TYPE_EXTERNAL

  const getViewsMessage = () => {
    const views = Object.values(table?.views ?? []);
    if (views.length < 1) {
      return ""
    }
    if (views.length === 1) {
      return ", including 1 view"
    }

    return `, including ${views.length} views`
  }

  function showDeleteModal() {
    viewsMessage = getViewsMessage()
    screensPossiblyAffected = $screenStore.screens
      .filter(
        screen => screen.autoTableId === table._id && screen.routing?.route
      )
      .map(screen => ({
        text: screen.routing.route,
        url: `/builder/app/${$appStore.appId}/design/${screen._id}`
      }))

    confirmDeleteDialog.show()
  }

  async function deleteTable() {
    const isSelected = $params.tableId === table._id
    try {
      await tables.delete(table)

      if (table.sourceType === DB_TYPE_EXTERNAL) {
        await datasources.fetch()
      }
      notifications.success("Table deleted")
      if (isSelected) {
        $goto(`./datasource/${table.datasourceId}`)
      }
    } catch (error) {
      notifications.error(`Error deleting table - ${error.message}`)
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

  const populateTableName = () => {
    deleteTableName = table.name
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon s hoverable name="MoreSmallList" />
  </div>
  {#if !externalTable}
    <MenuItem icon="Edit" on:click={editorModal.show}>Edit</MenuItem>
  {/if}
  <MenuItem icon="Delete" on:click={showDeleteModal}>Delete</MenuItem>
</ActionMenu>

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
  <div class="content">
    <p class="firstWarning">
      Are you sure you wish to delete the table
      <span class="tableNameLine">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <b on:click={populateTableName} class="tableName">{table.name}</b>
        <span>?</span>
      </span>
    </p>

    <p class="secondWarning">All table data will be deleted{viewsMessage}.</p>
    <p class="thirdWarning">This action <b>cannot be undone</b>.</p>

    {#if screensPossiblyAffected.length > 0}
      <div class="affectedScreens">
        <InlineAlert header="The following screens were originally generated from this table and may no longer function as expected">
      <ul class="affectedScreensList">
        {#each screensPossiblyAffected as item}
          <li><Link quiet overBackground target="_blank" href={item.url}>{item.text}</Link></li>
        {/each}
      </ul>
        </InlineAlert>
      </div>
    {/if}
    <p class="fourthWarning">
      Please enter the app name below to confirm.
    </p>
    <Input bind:value={deleteTableName} placeholder={table.name} />
  </div>
</ConfirmDialog>

<style>
  .icon {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }

  .content {
    margin-top: 0;
    max-width: 320px;
  }

  .firstWarning {
    margin: 0 0 12px;
    max-width: 100%;
  }

  .tableNameLine {
    display: inline-flex;
    max-width: 100%;
    vertical-align: bottom;
  }

  .tableName {
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .secondWarning {
    margin: 0;
    max-width: 100%;
  }

  .thirdWarning {
    margin: 0 0 12px;
    max-width: 100%;
  }

  .affectedScreens {
    margin: 18px 0;
    max-width: 100%;
    margin-bottom: 24px;
  }

  .affectedScreens :global(.spectrum-InLineAlert) {
    max-width: 100%;
  }

  .affectedScreensList {
    padding: 0;
    margin-bottom: 0;
  }

  .affectedScreensList li {
    display: block;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 4px;
  }

  .fourthWarning {
    margin: 12px 0 6px;
    max-width: 100%;
  }
</style>

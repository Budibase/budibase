<script>
  import { goto } from "@roxi/routify"
  import { allScreens, store } from "builderStore"
  import { tables } from "stores/backend"
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
  import { _ as t } from "svelte-i18n"

  export let table

  let editorModal
  let confirmDeleteDialog
  let error = ""
  let originalName = table.name
  let templateScreens
  let willBeDeleted

  $: external = table?.type === "external"

  function showDeleteModal() {
    templateScreens = $allScreens.filter(
      screen => screen.autoTableId === table._id
    )
    willBeDeleted = [$t('all-table-data')].concat(
      templateScreens.map(screen => $t('screen') + ` ${screen.props._instanceName}`)
    )
    confirmDeleteDialog.show()
  }

  async function deleteTable() {
    const wasSelectedTable = $tables.selected
    await tables.delete(table)
    store.actions.screens.delete(templateScreens)
    await tables.fetch()
    notifications.success($t('table-deleted'))
    if (wasSelectedTable._id === table._id) {
      $goto("./table")
    }
  }

  async function save() {
    await tables.save(table)
    notifications.success($t('table-renamed-successfully'))
  }

  function checkValid(evt) {
    const tableName = evt.target.value
    error =
      originalName === tableName
        ? $t('table-with-name') + ` ${tableName} ` + $t('already-exists-please-choose-another-name')
        : ""
  }
</script>

<ActionMenu>
  <div slot="control" class="icon">
    <Icon s hoverable name="MoreSmallList" />
  </div>
  <MenuItem icon="Edit" on:click={editorModal.show}>{ $t('edit') }</MenuItem>
  {#if !external}
    <MenuItem icon="Delete" on:click={showDeleteModal}>{ $t('delete') }</MenuItem>
  {/if}
</ActionMenu>

<Modal bind:this={editorModal}>
  <ModalContent
    title={ $t('edit-table') }
    confirmText={ $t('save') }
    onConfirm={save}
    disabled={table.name === originalName || error}
  >
    <Input
      label={ $t('table-name') }
      thin
      bind:value={table.name}
      on:input={checkValid}
      {error}
    />
  </ModalContent>
</Modal>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText={ $t('delete-table') }
  onOk={deleteTable}
  title={ $t('confirm-deletion') }
>
  { $t('are-you-sure-you-wish-to-delete-the-table') }
  <i>{table.name}?</i>
  { $t('the-following-will-also-be-deleted') }
  <b>
    <div class="delete-items">
      {#each willBeDeleted as item}
        <div>{item}</div>
      {/each}
    </div>
  </b>
  { $t('this-action-cannot-be-undone') }
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

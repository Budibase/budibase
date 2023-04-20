<script>
  import { goto, params } from "@roxi/routify"
  import { store } from "builderStore"
  import { cloneDeep } from "lodash/fp"
  import { tables, datasources } from "stores/backend"
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
  import { _ } from "../../../../../lang/i18n"

  export let table

  let editorModal
  let confirmDeleteDialog
  let error = ""

  let originalName
  let updatedName

  let templateScreens
  let willBeDeleted
  let deleteTableName

  $: external = table?.type === "external"
  $: allowDeletion = !external || table?.created

  function showDeleteModal() {
    templateScreens = $store.screens.filter(
      screen => screen.autoTableId === table._id
    )
    willBeDeleted = [
      $_(
        "components.backend.TableNavigation.popovers.EditTablePopover.All_data"
      ),
    ].concat(
      templateScreens.map(
        screen =>
          `${$_(
            "components.backend.TableNavigation.popovers.EditTablePopover.Screen"
          )} ${screen.props._instanceName}`
      )
    )
    confirmDeleteDialog.show()
  }

  async function deleteTable() {
    const isSelected = $params.tableId === table._id
    try {
      await tables.delete(table)
      await store.actions.screens.delete(templateScreens)
      if (table.type === "external") {
        await datasources.fetch()
      }
      notifications.success(
        $_(
          "components.backend.TableNavigation.popovers.EditTablePopover.Table_deleted"
        )
      )
      if (isSelected) {
        $goto(`./datasource/${table.datasourceId}`)
      }
    } catch (error) {
      notifications.error(
        $_(
          "components.backend.TableNavigation.popovers.EditTablePopover.Error_deleting"
        )
      )
    }
  }

  function hideDeleteDialog() {
    deleteTableName = ""
  }

  async function save() {
    const updatedTable = cloneDeep(table)
    updatedTable.name = updatedName
    await tables.save(updatedTable)
    notifications.success(
      $_(
        "components.backend.TableNavigation.popovers.EditTablePopover.Table_renamed"
      )
    )
  }

  function checkValid(evt) {
    const tableName = evt.target.value
    error =
      originalName === tableName
        ? `${$_(
            "components.backend.TableNavigation.popovers.EditTablePopover.Table_name"
          )} ${tableName} ${$_(
            "components.backend.TableNavigation.popovers.EditTablePopover.already_exists"
          )}.`
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
    {#if !external}
      <MenuItem icon="Edit" on:click={editorModal.show}
        >{$_(
          "components.backend.TableNavigation.popovers.EditTablePopover.Edit"
        )}</MenuItem
      >
    {/if}
    <MenuItem icon="Delete" on:click={showDeleteModal}
      >{$_(
        "components.backend.TableNavigation.popovers.EditTablePopover.Delete"
      )}</MenuItem
    >
  </ActionMenu>
{/if}

<Modal bind:this={editorModal} on:show={initForm}>
  <ModalContent
    title={$_(
      "components.backend.TableNavigation.popovers.EditTablePopover.Edit_Table"
    )}
    confirmText={$_(
      "components.backend.TableNavigation.popovers.EditTablePopover.Save"
    )}
    onConfirm={save}
    disabled={updatedName === originalName || error}
  >
    <Input
      label={$_(
        "components.backend.TableNavigation.popovers.EditTablePopover.Table_Name"
      )}
      thin
      bind:value={updatedName}
      on:input={checkValid}
      {error}
    />
  </ModalContent>
</Modal>
<ConfirmDialog
  bind:this={confirmDeleteDialog}
  okText={$_(
    "components.backend.TableNavigation.popovers.EditTablePopover.Delete_Table"
  )}
  onOk={deleteTable}
  onCancel={hideDeleteDialog}
  title={$_(
    "components.backend.TableNavigation.popovers.EditTablePopover.Confirm_Deletion"
  )}
  disabled={deleteTableName !== table.name}
>
  <p>
    {$_(
      "components.backend.TableNavigation.popovers.EditTablePopover.wish_delete"
    )}
    <b>{table.name}?</b>
    {$_("components.backend.TableNavigation.popovers.EditTablePopover.deleted")}
  </p>
  <b>
    <div class="delete-items">
      {#each willBeDeleted as item}
        <div>{item}</div>
      {/each}
    </div>
  </b>
  <p>
    {$_("components.backend.TableNavigation.popovers.EditTablePopover.undone")}
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

<script>
  import { fade } from "svelte/transition"
  import { goto, params } from "@roxi/routify"
  import { Table, Modal, Heading, notifications, Layout } from "@budibase/bbui"
  import { API } from "api"
  import Spinner from "components/common/Spinner.svelte"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"
  import DeleteRowsButton from "./buttons/DeleteRowsButton.svelte"
  import CreateEditRow from "./modals/CreateEditRow.svelte"
  import CreateEditUser from "./modals/CreateEditUser.svelte"
  import CreateEditColumn from "./modals/CreateEditColumn.svelte"
  import { cloneDeep } from "lodash/fp"
  import {
    TableNames,
    UNEDITABLE_USER_FIELDS,
    UNSORTABLE_TYPES,
  } from "constants"
  import RoleCell from "./cells/RoleCell.svelte"
  import { createEventDispatcher } from "svelte"

  export let schema = {}
  export let data = []
  export let tableId
  export let title
  export let allowEditing = false
  export let loading = false
  export let hideAutocolumns
  export let rowCount
  export let disableSorting = false
  export let customPlaceholder = false

  const dispatch = createEventDispatcher()

  let selectedRows = []
  let editableColumn
  let editableRow
  let editRowModal
  let editColumnModal
  let customRenderers = []
  let confirmDelete

  $: selectedRows, dispatch("selectionUpdated", selectedRows)
  $: isUsersTable = tableId === TableNames.USERS
  $: data && resetSelectedRows()
  $: editRowComponent = isUsersTable ? CreateEditUser : CreateEditRow
  $: {
    UNSORTABLE_TYPES.forEach(type => {
      Object.values(schema || {}).forEach(col => {
        if (col.type === type) {
          col.sortable = false
        }
      })
    })
  }
  $: {
    if (isUsersTable) {
      customRenderers = [
        {
          column: "roleId",
          component: RoleCell,
        },
      ]
      UNEDITABLE_USER_FIELDS.forEach(field => {
        if (schema[field]) {
          schema[field].editable = false
        }
      })
      if (schema.email) {
        schema.email.displayName = "Email"
      }
      if (schema.roleId) {
        schema.roleId.displayName = "Role"
      }
      if (schema.firstName) {
        schema.firstName.displayName = "First Name"
      }
      if (schema.lastName) {
        schema.lastName.displayName = "Last Name"
      }
      if (schema.status) {
        schema.status.displayName = "Status"
      }
    }
  }

  const resetSelectedRows = () => {
    selectedRows = []
  }

  const selectRelationship = ({ tableId, rowId, fieldName }) => {
    $goto(
      `/builder/app/${$params.application}/data/table/${tableId}/relationship/${rowId}/${fieldName}`
    )
  }

  const deleteRows = async targetRows => {
    try {
      await API.deleteRows({
        tableId,
        rows: targetRows,
      })

      const deletedRowIds = targetRows.map(row => row._id)
      data = data.filter(row => deletedRowIds.indexOf(row._id))

      notifications.success(`Successfully deleted ${targetRows.length} rows`)
    } catch (error) {
      notifications.error("Error deleting rows")
    }
  }

  const editRow = row => {
    editableRow = row
    if (row) {
      editRowModal.show()
    }
  }

  const editColumn = field => {
    editableColumn = cloneDeep(schema?.[field])
    if (editableColumn) {
      editColumnModal.show()
    }
  }
</script>

<Layout noPadding gap="S">
  <Layout noPadding gap="XS">
    {#if title}
      <div class="table-title">
        <Heading size="M">{title}</Heading>
        {#if loading}
          <div transition:fade|local>
            <Spinner size="10" />
          </div>
        {/if}
      </div>
    {/if}
    <div class="popovers">
      <slot />
      {#if !isUsersTable && selectedRows.length > 0}
        <DeleteRowsButton
          on:updaterows
          {selectedRows}
          deleteRows={async rows => {
            await deleteRows(rows)
            resetSelectedRows()
          }}
        />
      {/if}
    </div>
  </Layout>
  {#key tableId}
    <div class="table-wrapper">
      <Table
        {data}
        {schema}
        {loading}
        {customRenderers}
        {rowCount}
        {disableSorting}
        {customPlaceholder}
        bind:selectedRows
        allowSelectRows={allowEditing && !isUsersTable}
        allowEditRows={allowEditing}
        allowEditColumns={allowEditing}
        showAutoColumns={!hideAutocolumns}
        on:editcolumn={e => editColumn(e.detail)}
        on:editrow={e => editRow(e.detail)}
        on:clickrelationship={e => selectRelationship(e.detail)}
        on:sort
      >
        <slot slot="placeholder" name="placeholder" />
      </Table>
    </div>
  {/key}
</Layout>

<Modal bind:this={editRowModal}>
  <svelte:component
    this={editRowComponent}
    on:updaterows
    on:deleteRows={() => {
      confirmDelete.show()
    }}
    row={editableRow}
  />
</Modal>

<ConfirmDialog
  bind:this={confirmDelete}
  okText="Delete"
  onOk={async () => {
    if (editableRow) {
      await deleteRows([editableRow])
    }
    editableRow = undefined
  }}
  onCancel={async () => {
    editRow(editableRow)
  }}
  title="Confirm Deletion"
>
  Are you sure you want to delete this row?
</ConfirmDialog>

<Modal bind:this={editColumnModal}>
  <CreateEditColumn
    field={editableColumn}
    on:updatecolumns
    onClosed={editColumnModal.hide}
  />
</Modal>

<style>
  .table-title {
    height: 24px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .table-title > div {
    margin-left: var(--spacing-xs);
  }
  .table-wrapper {
    overflow: hidden;
  }

  .popovers {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-s);
  }
  .popovers :global(button) {
    font-weight: 600;
    margin-top: var(--spacing-l);
  }
  .popovers :global(button svg) {
    margin-right: var(--spacing-xs);
  }
</style>

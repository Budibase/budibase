<script>
  import { fade } from "svelte/transition"
  import { goto, params } from "@roxi/routify"
  import { Table, Modal } from "@budibase/bbui"

  import api from "builderStore/api"
  import { notifications } from "@budibase/bbui"
  import Spinner from "components/common/Spinner.svelte"
  import DeleteRowsButton from "./buttons/DeleteRowsButton.svelte"
  import CreateEditRow from "./modals/CreateEditRow.svelte"
  import CreateEditUser from "./modals/CreateEditUser.svelte"
  import CreateEditColumn from "./modals/CreateEditColumn.svelte"
  import "@budibase/svelte-ag-grid/dist/index.css"
  import { TableNames, UNEDITABLE_USER_FIELDS } from "constants"
  import RoleCell from "./cells/RoleCell.svelte"

  export let schema = {}
  export let data = []
  export let tableId
  export let title
  export let allowEditing = false
  export let loading = false
  export let theme = "alpine"
  export let hideAutocolumns
  export let rowCount

  let selectedRows = []
  let editableColumn
  let editableRow
  let editRowModal
  let editColumnModal
  let customRenderers = []

  $: isUsersTable = tableId === TableNames.USERS
  $: data && resetSelectedRows()
  $: editRowComponent = isUsersTable ? CreateEditUser : CreateEditRow
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
      schema.email.displayName = "Email"
      schema.roleId.displayName = "Role"
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
      `/builder/${$params.application}/data/table/${tableId}/relationship/${rowId}/${fieldName}`
    )
  }

  const deleteRows = async () => {
    await api.post(`/api/${tableId}/rows`, {
      rows: selectedRows,
      type: "delete",
    })
    data = data.filter(row => !selectedRows.includes(row))
    notifications.success(`Successfully deleted ${selectedRows.length} rows`)
    selectedRows = []
  }

  const editRow = row => {
    editableRow = row
    if (row) {
      editRowModal.show()
    }
  }

  const editColumn = field => {
    editableColumn = schema?.[field]
    if (editableColumn) {
      editColumnModal.show()
    }
  }
</script>

<div>
  <div class="table-title">
    {#if title}
      <h1>{title}</h1>
    {/if}
    {#if loading}
      <div transition:fade>
        <Spinner size="10" />
      </div>
    {/if}
  </div>
  <div class="popovers">
    <slot />
    {#if selectedRows.length > 0}
      <DeleteRowsButton {selectedRows} {deleteRows} />
    {/if}
  </div>
</div>
{#key tableId}
  <Table
    {data}
    {schema}
    {loading}
    {customRenderers}
    {rowCount}
    bind:selectedRows
    allowSelectRows={allowEditing}
    allowEditRows={allowEditing}
    allowEditColumns={allowEditing}
    showAutoColumns={!hideAutocolumns}
    on:editcolumn={e => editColumn(e.detail)}
    on:editrow={e => editRow(e.detail)}
    on:clickrelationship={e => selectRelationship(e.detail)} />
{/key}

<Modal bind:this={editRowModal}>
  <svelte:component this={editRowComponent} row={editableRow} />
</Modal>
<Modal bind:this={editColumnModal}>
  <CreateEditColumn field={editableColumn} onClosed={editColumnModal.hide} />
</Modal>

<style>
  .table-title {
    height: 24px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .table-title h1 {
    font-size: var(--font-size-m);
    font-weight: 500;
    margin: 0;
  }
  .table-title > div {
    margin-left: var(--spacing-xs);
  }

  .popovers {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-s);
  }
  .popovers :global(button) {
    font-weight: 500;
    margin-top: var(--spacing-l);
  }
  .popovers :global(button svg) {
    margin-right: var(--spacing-xs);
  }
</style>

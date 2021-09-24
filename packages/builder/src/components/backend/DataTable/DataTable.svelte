<script>
  import { tables } from "stores/backend"
  import CreateRowButton from "./buttons/CreateRowButton.svelte"
  import CreateColumnButton from "./buttons/CreateColumnButton.svelte"
  import CreateViewButton from "./buttons/CreateViewButton.svelte"
  import ExportButton from "./buttons/ExportButton.svelte"
  import EditRolesButton from "./buttons/EditRolesButton.svelte"
  import ManageAccessButton from "./buttons/ManageAccessButton.svelte"
  import HideAutocolumnButton from "./buttons/HideAutocolumnButton.svelte"
  import Table from "./Table.svelte"
  import { TableNames } from "constants"
  import CreateEditRow from "./modals/CreateEditRow.svelte"
  import { fetchTableData } from "helpers/fetchTableData"
  import { Pagination } from "@budibase/bbui"

  const data = fetchTableData()
  let hideAutocolumns = true

  $: isUsersTable = $tables.selected?._id === TableNames.USERS
  $: title = $tables.selected?.name
  $: schema = $tables.selected?.schema
  $: type = $tables.selected?.type
  $: isInternal = type !== "external"
  $: id = $tables.selected?._id
  $: fetchTable(id)

  const fetchTable = tableId => {
    data.update({
      tableId,
      schema,
      limit: 10,
      paginate: true,
    })
  }

  // Fetch data whenever sorting option changes
  const onSort = e => {
    data.update({
      sortColumn: e.detail.column,
      sortOrder: e.detail.order,
    })
  }
</script>

<div>
  <Table
    {title}
    {schema}
    {type}
    tableId={$tables.selected?._id}
    data={$data.rows}
    bind:hideAutocolumns
    loading={$data.loading}
    on:sort={onSort}
    allowEditing
    disableSorting
  >
    {#if isInternal}
      <CreateColumnButton />
    {/if}
    {#if schema && Object.keys(schema).length > 0}
      {#if !isUsersTable}
        <CreateRowButton
          title={"Create row"}
          modalContentComponent={CreateEditRow}
        />
      {/if}
      {#if isInternal}
        <CreateViewButton />
      {/if}
      <ManageAccessButton resourceId={$tables.selected?._id} />
      {#if isUsersTable}
        <EditRolesButton />
      {/if}
      <HideAutocolumnButton bind:hideAutocolumns />
      <!-- always have the export last -->
      <ExportButton view={$tables.selected?._id} />
    {/if}
  </Table>
  <div class="pagination">
    <Pagination
      page={$data.pageNumber + 1}
      hasPrevPage={$data.hasPrevPage}
      hasNextPage={$data.hasNextPage}
      goToPrevPage={$data.loading ? null : data.prevPage}
      goToNextPage={$data.loading ? null : data.nextPage}
    />
  </div>
</div>

<style>
  .pagination {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-top: var(--spacing-xl);
  }
</style>

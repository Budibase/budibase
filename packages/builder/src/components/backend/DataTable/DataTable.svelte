<script>
  import { tables } from "stores/backend"
  import CreateRowButton from "./buttons/CreateRowButton.svelte"
  import CreateColumnButton from "./buttons/CreateColumnButton.svelte"
  import CreateViewButton from "./buttons/CreateViewButton.svelte"
  import ExportButton from "./buttons/ExportButton.svelte"
  import EditRolesButton from "./buttons/EditRolesButton.svelte"
  import ManageAccessButton from "./buttons/ManageAccessButton.svelte"
  import HideAutocolumnButton from "./buttons/HideAutocolumnButton.svelte"
  import TableFilterButton from "./buttons/TableFilterButton.svelte"
  import Table from "./Table.svelte"
  import { TableNames } from "constants"
  import CreateEditRow from "./modals/CreateEditRow.svelte"
  import { fetchTableData } from "helpers/fetchTableData"
  import { Pagination } from "@budibase/bbui"

  const search = fetchTableData()
  let hideAutocolumns = true
  let filters

  $: isUsersTable = $tables.selected?._id === TableNames.USERS
  $: title = $tables.selected?.name
  $: schema = $tables.selected?.schema
  $: type = $tables.selected?.type
  $: isInternal = type !== "external"
  $: id = $tables.selected?._id
  $: columnOptions = Object.keys($search.schema || {})
  $: fetchTable(id, filters)

  // Fetches new data whenever the table changes
  const fetchTable = (tableId, filters) => {
    search.update({
      tableId,
      schema,
      filters,
      limit: 10,
      paginate: true,
    })
  }

  // Fetch data whenever sorting option changes
  const onSort = e => {
    search.update({
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
    data={$search.rows}
    bind:hideAutocolumns
    loading={$search.loading}
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
      <TableFilterButton
        {schema}
        {filters}
        on:change={e => (filters = e.detail)}
      />
    {/if}
  </Table>
  <div class="pagination">
    <Pagination
      page={$search.pageNumber + 1}
      hasPrevPage={$search.hasPrevPage}
      hasNextPage={$search.hasNextPage}
      goToPrevPage={$search.loading ? null : search.prevPage}
      goToNextPage={$search.loading ? null : search.nextPage}
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

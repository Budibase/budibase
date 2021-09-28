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
  import { Layout, Pagination, Select, Input } from "@budibase/bbui"
  import { OperatorOptions } from "constants/lucene"

  const search = fetchTableData()
  let hideAutocolumns = true
  let searchColumn
  let searchValue

  $: isUsersTable = $tables.selected?._id === TableNames.USERS
  $: title = $tables.selected?.name
  $: schema = $tables.selected?.schema
  $: type = $tables.selected?.type
  $: isInternal = type !== "external"
  $: id = $tables.selected?._id
  $: columnOptions = Object.keys($search.schema || {})
  $: filter = buildFilter(searchColumn, searchValue)
  $: fetchTable(id, filter)

  // Fetches new data whenever the table changes
  const fetchTable = (tableId, filter) => {
    search.update({
      tableId,
      schema,
      filter,
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

  // Builds a filter expression to search with
  const buildFilter = (column, value) => {
    if (!column || !value) {
      return null
    }
    return [
      {
        type: "string",
        field: column,
        operator: OperatorOptions.StartsWith.value,
        value,
      },
    ]
  }

  $: console.log(filter)
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
    <Layout noPadding gap="S">
      <div class="buttons">
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
      </div>
      <div class="search">
        <Select bind:value={searchColumn} options={columnOptions} />
        <Input
          updateOnChange={false}
          on:change={e => (searchValue = e.detail)}
          placeholder="Search"
        />
      </div>
    </Layout>
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
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-s);
  }
  .search {
    display: grid;
    align-items: center;
    grid-template-columns: 200px 200px;
    gap: var(--spacing-s);
  }
  .pagination {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-top: var(--spacing-xl);
  }
</style>

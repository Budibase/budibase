<script>
  import { fade } from "svelte/transition"
  import { tables } from "stores/backend"
  import CreateRowButton from "./buttons/CreateRowButton.svelte"
  import CreateColumnButton from "./buttons/CreateColumnButton.svelte"
  import CreateViewButton from "./buttons/CreateViewButton.svelte"
  import ExistingRelationshipButton from "./buttons/ExistingRelationshipButton.svelte"
  import ExportButton from "./buttons/ExportButton.svelte"
  import ImportButton from "./buttons/ImportButton.svelte"
  import EditRolesButton from "./buttons/EditRolesButton.svelte"
  import ManageAccessButton from "./buttons/ManageAccessButton.svelte"
  import HideAutocolumnButton from "./buttons/HideAutocolumnButton.svelte"
  import TableFilterButton from "./buttons/TableFilterButton.svelte"
  import Table from "./Table.svelte"
  import { TableNames } from "constants"
  import CreateEditRow from "./modals/CreateEditRow.svelte"
  import { Pagination } from "@budibase/bbui"
  import { fetchData } from "@budibase/frontend-core"
  import { API } from "api"

  let hideAutocolumns = true

  $: isUsersTable = $tables.selected?._id === TableNames.USERS
  $: type = $tables.selected?.type
  $: isInternal = type !== "external"
  $: schema = $tables.selected?.schema
  $: enrichedSchema = enrichSchema($tables.selected?.schema)
  $: id = $tables.selected?._id
  $: fetch = createFetch(id)

  const enrichSchema = schema => {
    let tempSchema = { ...schema }
    tempSchema._id = {
      type: "internal",
      editable: false,
      displayName: "ID",
      autocolumn: true,
    }
    if (isInternal) {
      tempSchema._rev = {
        type: "internal",
        editable: false,
        displayName: "Revision",
        autocolumn: true,
      }
    }

    return tempSchema
  }
  // Fetches new data whenever the table changes
  const createFetch = tableId => {
    return fetchData({
      API,
      datasource: {
        tableId,
        type: "table",
      },
      options: {
        schema,
        limit: 10,
        paginate: true,
      },
    })
  }

  // Fetch data whenever sorting option changes
  const onSort = e => {
    fetch.update({
      sortColumn: e.detail.column,
      sortOrder: e.detail.order,
    })
  }

  // Fetch data whenever filters change
  const onFilter = e => {
    fetch.update({
      filter: e.detail,
    })
  }

  // Fetch data whenever schema changes
  const onUpdateColumns = () => {
    fetch.refresh()
  }

  // Fetch data whenever rows are modified. Unfortunately we have to lose
  // our pagination place, as our bookmarks will have shifted.
  const onUpdateRows = () => {
    fetch.refresh()
  }
</script>

<div>
  <Table
    title={$tables.selected?.name}
    schema={enrichedSchema}
    {type}
    tableId={id}
    data={$fetch.rows}
    bind:hideAutocolumns
    loading={!$fetch.loaded}
    on:sort={onSort}
    allowEditing
    disableSorting
    on:updatecolumns={onUpdateColumns}
    on:updaterows={onUpdateRows}
  >
    <CreateColumnButton on:updatecolumns={onUpdateColumns} />
    {#if schema && Object.keys(schema).length > 0}
      {#if !isUsersTable}
        <CreateRowButton
          on:updaterows={onUpdateRows}
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
      {#if !isInternal}
        <ExistingRelationshipButton
          table={$tables.selected}
          on:updatecolumns={onUpdateColumns}
        />
      {/if}
      <HideAutocolumnButton bind:hideAutocolumns />
      <!-- always have the export last -->
      <ExportButton view={$tables.selected?._id} />
      <ImportButton
        tableId={$tables.selected?._id}
        on:updaterows={onUpdateRows}
      />
      {#key id}
        <TableFilterButton {schema} on:change={onFilter} />
      {/key}
    {/if}
  </Table>
  {#key id}
    <div in:fade={{ delay: 200, duration: 100 }}>
      <div class="pagination">
        <Pagination
          page={$fetch.pageNumber + 1}
          hasPrevPage={$fetch.hasPrevPage}
          hasNextPage={$fetch.hasNextPage}
          goToPrevPage={$fetch.loading ? null : fetch.prevPage}
          goToNextPage={$fetch.loading ? null : fetch.nextPage}
        />
      </div>
    </div>
  {/key}
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

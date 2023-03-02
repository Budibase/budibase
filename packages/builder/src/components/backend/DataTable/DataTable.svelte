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
  import {
    Pagination,
    Heading,
    Body,
    Modal,
    Layout,
    notifications,
  } from "@budibase/bbui"
  import { fetchData, Sheet } from "@budibase/frontend-core"
  import { API } from "api"
  import CreateEditColumn from "components/backend/DataTable/modals/CreateEditColumn.svelte"

  let createColumnModal

  let hideAutocolumns = true
  let filters
  let hasRows = true

  $: isUsersTable = $tables.selected?._id === TableNames.USERS
  $: type = $tables.selected?.type
  $: isInternal = type !== "external"
  $: schema = $tables.selected?.schema
  $: enrichedSchema = enrichSchema($tables.selected?.schema)
  $: id = $tables.selected?._id
  $: hasCols = checkHasCols(schema)
  $: id, (filters = null)

  let appliedFilter
  let rawFilter
  let appliedSort
  let selectedRows = []

  $: enrichedSchema,
    () => {
      appliedFilter = null
      rawFilter = null
      appliedSort = null
      selectedRows = []
    }

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

  const checkHasCols = schema => {
    if (!schema || Object.keys(schema).length === 0) {
      return false
    }
    let fields = Object.values(schema)
    for (let field of fields) {
      if (!field.autocolumn) {
        return true
      }
    }
    return false
  }

  // Fetch data whenever sorting option changes
  const onSort = async e => {
    const sort = {
      sortColumn: e.detail.column,
      sortOrder: e.detail.order,
    }
    appliedSort = { ...sort }
    appliedSort.sortOrder = appliedSort.sortOrder.toLowerCase()
    selectedRows = []
  }

  // Fetch data whenever filters change
  const onFilter = e => {
    filters = e.detail
    appliedFilter = e.detail
  }
</script>

<div class="wrapper">
  <div class="buttons">
    <div class="left-buttons">
      <CreateColumnButton
        highlighted={!hasCols || !hasRows}
        on:updatecolumns={null}
      />
      {#if isInternal}
        <CreateViewButton disabled={!hasCols || !hasRows} />
      {/if}
    </div>
    <div class="right-buttons">
      <ManageAccessButton resourceId={$tables.selected?._id} />
      {#if isUsersTable}
        <EditRolesButton />
      {/if}
      {#if !isInternal}
        <ExistingRelationshipButton
          table={$tables.selected}
          on:updatecolumns={null}
        />
      {/if}
      <ImportButton
        disabled={$tables.selected?._id === "ta_users"}
        tableId={$tables.selected?._id}
        on:importrows={null}
      />
      <ExportButton
        disabled={!hasRows || !hasCols}
        view={$tables.selected?._id}
        filters={appliedFilter}
        sorting={appliedSort}
        {selectedRows}
      />
      {#key id}
        <TableFilterButton
          {schema}
          {filters}
          on:change={onFilter}
          disabled={!hasCols}
          tableId={id}
        />
      {/key}
    </div>
  </div>
  <div class="sheet">
    <Sheet
      tableId={$tables.selected?._id}
      {API}
      filter={filters}
      on:add-column={createColumnModal.show}
    />
  </div>
</div>

<!--<div>-->
<!--  <Table-->
<!--    title={$tables.selected?.name}-->
<!--    schema={enrichedSchema}-->
<!--    {type}-->
<!--    tableId={id}-->
<!--    data={$fetch.rows}-->
<!--    bind:hideAutocolumns-->
<!--    loading={!$fetch.loaded}-->
<!--    on:sort={onSort}-->
<!--    allowEditing-->
<!--    disableSorting-->
<!--    on:updatecolumns={onUpdateColumns}-->
<!--    on:updaterows={onUpdateRows}-->
<!--    on:selectionUpdated={e => {-->
<!--      selectedRows = e.detail-->
<!--    }}-->
<!--    customPlaceholder-->
<!--  >-->
<!--    <div slot="placeholder">-->
<!--      <Layout gap="S">-->
<!--        {#if !hasCols}-->
<!--          <Heading>Let's create some columns</Heading>-->
<!--          <Body>-->
<!--            Start building out your table structure<br />-->
<!--            by adding some columns-->
<!--          </Body>-->
<!--        {:else}-->
<!--          <Heading>Now let's add a row</Heading>-->
<!--          <Body>-->
<!--            Add some data to your table<br />-->
<!--            by adding some rows-->
<!--          </Body>-->
<!--        {/if}-->
<!--      </Layout>-->
<!--    </div>-->
<!--  </Table>-->
<!--  {#key id}-->
<!--    <div in:fade={{ delay: 200, duration: 100 }}>-->
<!--      <div class="pagination">-->
<!--        <Pagination-->
<!--          page={$fetch.pageNumber + 1}-->
<!--          hasPrevPage={$fetch.hasPrevPage}-->
<!--          hasNextPage={$fetch.hasNextPage}-->
<!--          goToPrevPage={$fetch.loading ? null : fetch.prevPage}-->
<!--          goToNextPage={$fetch.loading ? null : fetch.nextPage}-->
<!--        />-->
<!--      </div>-->
<!--    </div>-->
<!--  {/key}-->

<!--</div>-->

<Modal bind:this={createColumnModal}>
  <CreateEditColumn on:updatecolumns />
</Modal>

<style>
  .wrapper {
    flex: 1 1 auto;
    margin: -28px -40px -40px -40px;
    display: flex;
    flex-direction: column;
    background: var(--background);
  }
  .sheet {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
  }
  .pagination {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-top: var(--spacing-xl);
  }
  .buttons {
    flex: 0 0 48px;
    border-bottom: 2px solid var(--spectrum-global-color-gray-200);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding: 0 8px;
  }
  .left-buttons,
  .right-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-m);
  }
</style>

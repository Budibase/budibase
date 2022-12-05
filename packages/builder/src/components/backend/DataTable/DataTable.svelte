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
    Layout,
    notifications,
  } from "@budibase/bbui"
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
  $: hasCols = checkHasCols(schema)
  $: hasRows = !!$fetch.rows?.length
  $: showError($fetch.error)

  const showError = error => {
    if (error) {
      notifications.error(error?.message || "Unable to fetch data.")
    }
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

  // When importing new rows it is better to reinitialise request/paging data.
  // Not doing so causes inconsistency in paging behaviour and content.
  const onImportData = () => {
    fetch.getInitialData()
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
    customPlaceholder
  >
    <div class="buttons">
      <div class="left-buttons">
        <CreateColumnButton
          highlighted={$fetch.loaded && (!hasCols || !hasRows)}
          on:updatecolumns={onUpdateColumns}
        />
        {#if !isUsersTable}
          <CreateRowButton
            on:updaterows={onUpdateRows}
            title={"Create row"}
            modalContentComponent={CreateEditRow}
            disabled={!hasCols}
            highlighted={$fetch.loaded && hasCols && !hasRows}
          />
        {/if}
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
            on:updatecolumns={onUpdateColumns}
          />
        {/if}
        <HideAutocolumnButton bind:hideAutocolumns />
        <ImportButton
          disabled={$tables.selected?._id === "ta_users"}
          tableId={$tables.selected?._id}
          on:importrows={onImportData}
        />
        <ExportButton
          disabled={!hasRows || !hasCols}
          view={$tables.selected?._id}
        />
        {#key id}
          <TableFilterButton
            {schema}
            on:change={onFilter}
            disabled={!hasCols}
          />
        {/key}
      </div>
    </div>
    <div slot="placeholder">
      <Layout gap="S">
        {#if !hasCols}
          <Heading>Let's create some columns</Heading>
          <Body>
            Start building out your table structure<br />
            by adding some columns
          </Body>
        {:else}
          <Heading>Now let's add a row</Heading>
          <Body>
            Add some data to your table<br />
            by adding some rows
          </Body>
        {/if}
      </Layout>
    </div>
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
  .buttons {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
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

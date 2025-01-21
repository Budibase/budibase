<script>
  import { goto, isActive, params } from "@roxi/routify"
  import { Layout } from "@budibase/bbui"
  import {
    datasources,
    queries,
    tables,
    views,
    viewsV2,
    userSelectedResourceMap,
  } from "@/stores/builder"
  import QueryNavItem from "./QueryNavItem.svelte"
  import NavItem from "@/components/common/NavItem.svelte"
  import TableNavigator from "@/components/backend/TableNavigator/TableNavigator.svelte"
  import DatasourceNavItem from "./DatasourceNavItem/DatasourceNavItem.svelte"
  import { TableNames } from "@/constants"
  import { enrichDatasources } from "./datasourceUtils"
  import { onMount } from "svelte"

  export let searchTerm
  let toggledDatasources = {}

  $: enrichedDataSources = enrichDatasources(
    $datasources,
    $params,
    $isActive,
    $tables,
    $queries,
    $views,
    $viewsV2,
    toggledDatasources,
    searchTerm
  )

  function selectDatasource(datasource) {
    openNode(datasource)
    $goto(`./datasource/${datasource._id}`)
  }

  const selectTable = tableId => {
    tables.select(tableId)
    $goto(`./table/${tableId}`)
  }

  function openNode(datasource) {
    toggledDatasources[datasource._id] = true
  }

  function toggleNode(datasource) {
    toggledDatasources[datasource._id] = !datasource.open
  }

  const appUsersTableName = "App users"
  $: showAppUsersTable =
    !searchTerm ||
    appUsersTableName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1

  onMount(() => {
    if ($tables.selected) {
      toggledDatasources[$tables.selected.sourceId] = true
    }
  })

  $: showNoResults =
    searchTerm && !showAppUsersTable && !enrichedDataSources.find(ds => ds.show)
</script>

<div class="hierarchy-items-container">
  {#if showAppUsersTable}
    <NavItem
      icon="UserGroup"
      text={appUsersTableName}
      selected={$isActive("./table/:tableId") &&
        $tables.selected?._id === TableNames.USERS}
      on:click={() => selectTable(TableNames.USERS)}
      selectedBy={$userSelectedResourceMap[TableNames.USERS]}
    />
  {/if}
  <NavItem
    icon="UserAdmin"
    text="Manage roles"
    selected={$isActive("./roles")}
    on:click={() => $goto("./roles")}
    selectedBy={$userSelectedResourceMap.roles}
  />
  {#each enrichedDataSources.filter(ds => ds.show) as datasource}
    <DatasourceNavItem
      {datasource}
      on:click={() => selectDatasource(datasource)}
      on:iconClick={() => toggleNode(datasource)}
    />
    {#if datasource.open}
      <TableNavigator tables={datasource.tables} {selectTable} />
      {#each datasource.queries as query}
        <QueryNavItem {datasource} {query} />
      {/each}
    {/if}
  {/each}
  {#if showNoResults}
    <Layout paddingY="none" paddingX="L">
      <div class="no-results">
        There aren't any datasources matching that name
      </div>
    </Layout>
  {/if}
</div>

<style>
  .hierarchy-items-container {
    margin: 0 calc(-1 * var(--spacing-l));
  }

  .no-results {
    color: var(--spectrum-global-color-gray-600);
  }
</style>

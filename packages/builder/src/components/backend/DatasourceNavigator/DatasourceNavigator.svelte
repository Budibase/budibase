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
    dataEnvironmentStore,
    workspaceDeploymentStore,
    workspaceConnections,
  } from "@/stores/builder"
  import QueryNavItem from "./QueryNavItem.svelte"
  import NavItem from "@/components/common/NavItem.svelte"
  import TableNavigator from "@/components/backend/TableNavigator/TableNavigator.svelte"
  import DatasourceNavItem from "./DatasourceNavItem/DatasourceNavItem.svelte"
  import { TableNames } from "@/constants"
  import { enrichDatasources } from "./datasourceUtils"
  import { onMount } from "svelte"
  import { DataEnvironmentMode } from "@budibase/types"
  import {
    customQueryIconText,
    customQueryIconColor,
  } from "@/helpers/data/utils"
  import { canCreateDatasourceQuery } from "./datasourceUtils"

  $goto
  $isActive
  $params

  export let searchTerm
  export let datasourceFilter = _ => true
  export let showAppUsers = true
  export let showManageRoles = true
  export let datasourceSort
  export let noResultsText = "There aren't any datasources matching that name"
  let toggledDatasources = {}

  $: ({ draftDatasource, draftQuery } = $workspaceConnections)
  $: draftQueryVerb = $workspaceConnections.draft?.query?.queryVerb

  $: enrichedDataSources = enrichDatasources(
    $datasources,
    $params,
    $isActive,
    $tables,
    $queries,
    $views,
    $viewsV2,
    toggledDatasources,
    searchTerm,
    datasourceFilter
  )

  $: sortedDatasources = datasourceSort
    ? enrichedDataSources.slice().sort(datasourceSort)
    : enrichedDataSources

  $: displayedDatasources = (() => {
    if (draftQuery?.datasourceId) {
      return sortedDatasources.map(ds => {
        if (ds._id !== draftQuery.datasourceId) return ds
        return { ...ds, open: true, queries: [draftQuery, ...ds.queries] }
      })
    }
    if (draftDatasource) {
      const effective =
        toggledDatasources["__draft__"] === false
          ? { ...draftDatasource, open: false }
          : draftDatasource
      return [effective, ...sortedDatasources]
    }
    return sortedDatasources
  })()

  function selectDatasource(datasource) {
    openNode(datasource)
    if (datasource.source !== "REST") {
      $goto(`./datasource/${datasource._id}`)
    }
  }

  const selectTable = tableId => {
    // Always use DEVELOPMENT environment if table is not published
    if (!$workspaceDeploymentStore.tables[tableId]?.published) {
      dataEnvironmentStore.setMode(DataEnvironmentMode.DEVELOPMENT)
    }
    tables.select(tableId)
    $goto(`./table/${tableId}`)
  }

  function openNode(datasource) {
    toggledDatasources[datasource._id] = true
  }

  function toggleNode(datasource) {
    toggledDatasources[datasource._id] = !datasource.open
  }

  const appUsersTableName = "End users"
  $: showAppUsersTable =
    showAppUsers &&
    (!searchTerm ||
      appUsersTableName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)

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
      icon="users-three"
      text={appUsersTableName}
      selected={$isActive("./table/:tableId") &&
        $tables.selected?._id === TableNames.USERS}
      on:click={() => selectTable(TableNames.USERS)}
      selectedBy={$userSelectedResourceMap[TableNames.USERS]}
    />
  {/if}
  {#if showManageRoles}
    <NavItem
      icon="user-gear"
      text="Custom roles"
      selected={$isActive("./roles")}
      on:click={() => $goto("./roles")}
      selectedBy={$userSelectedResourceMap.roles}
    />
  {/if}
  {#each displayedDatasources.filter(ds => ds.show) as datasource}
    <DatasourceNavItem
      {datasource}
      on:click={() => selectDatasource(datasource)}
      on:iconClick={() => toggleNode(datasource)}
    />
    {#if datasource.open}
      <TableNavigator tables={datasource.tables} {selectTable} />
      {#each datasource.queries as query}
        {#if query._id === "__draft_query__"}
          {@const hasDatasource =
            !!$workspaceConnections.draft?.query?.datasourceId}
          <NavItem
            indentLevel={1}
            iconText={customQueryIconText(draftQueryVerb)}
            iconColor={hasDatasource
              ? (customQueryIconColor(draftQueryVerb) ?? "#00a4e4")
              : undefined}
            text={query.name}
            selected={true}
            on:click={() => $goto("./query/new")}
          />
        {:else}
          <QueryNavItem {datasource} {query} />
        {/if}
      {/each}
      {#if datasource.source === "REST" && datasource._id !== "__draft__" && canCreateDatasourceQuery(datasource)}
        <span class="add-operation">
          <NavItem
            indentLevel={0}
            icon="plus"
            text="New API operation"
            on:click={() =>
              $goto(`/builder/workspace/:application/apis/query/new/:id`, {
                application: $params.application,
                id: datasource._id,
              })}
          />
        </span>
      {/if}
    {/if}
  {/each}

  {#if showNoResults}
    <Layout paddingY="none" paddingX="L">
      <div class="no-results">
        {noResultsText}
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

  .add-operation :global(.nav-item-body .text) {
    font-size: 0.95em;
    color: var(--spectrum-global-color-gray-700);
  }
</style>

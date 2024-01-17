<script>
  import { goto, isActive, params } from "@roxi/routify"
  import { Layout } from "@budibase/bbui"
  import { BUDIBASE_INTERNAL_DB_ID } from "constants/backend"
  import { datasources, queries, tables, views, viewsV2 } from "stores/builder"
  import EditDatasourcePopover from "./popovers/EditDatasourcePopover.svelte"
  import EditQueryPopover from "./popovers/EditQueryPopover.svelte"
  import NavItem from "components/common/NavItem.svelte"
  import TableNavigator from "components/backend/TableNavigator/TableNavigator.svelte"
  import {
    customQueryIconText,
    customQueryIconColor,
    customQueryText,
  } from "helpers/data/utils"
  import IntegrationIcon from "./IntegrationIcon.svelte"
  import { TableNames } from "constants"
  import { userSelectedResourceMap, database } from "stores/builder"
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
    if (!$isActive("./table/:tableId")) {
      $goto(`./table/${tableId}`)
    }
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

{#if $database?._id}
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
    {#each enrichedDataSources.filter(ds => ds.show) as datasource}
      <NavItem
        border
        text={datasource.name}
        opened={datasource.open}
        selected={$isActive("./datasource") && datasource.selected}
        withArrow={true}
        on:click={() => selectDatasource(datasource)}
        on:iconClick={() => toggleNode(datasource)}
        selectedBy={$userSelectedResourceMap[datasource._id]}
      >
        <div class="datasource-icon" slot="icon">
          <IntegrationIcon
            integrationType={datasource.source}
            schema={datasource.schema}
            size="18"
          />
        </div>
        {#if datasource._id !== BUDIBASE_INTERNAL_DB_ID}
          <EditDatasourcePopover {datasource} />
        {/if}
      </NavItem>

      {#if datasource.open}
        <TableNavigator tables={datasource.tables} {selectTable} />
        {#each datasource.queries as query}
          <NavItem
            indentLevel={1}
            icon="SQLQuery"
            iconText={customQueryIconText(datasource, query)}
            iconColor={customQueryIconColor(datasource, query)}
            text={customQueryText(datasource, query)}
            selected={$isActive("./query/:queryId") &&
              $queries.selectedQueryId === query._id}
            on:click={() => $goto(`./query/${query._id}`)}
            selectedBy={$userSelectedResourceMap[query._id]}
          >
            <EditQueryPopover {query} />
          </NavItem>
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
{/if}

<style>
  .hierarchy-items-container {
    margin: 0 calc(-1 * var(--spacing-l));
  }
  .datasource-icon {
    display: grid;
    place-items: center;
    flex: 0 0 24px;
  }

  .no-results {
    color: var(--spectrum-global-color-gray-600);
  }
</style>

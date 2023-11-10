<script>
  import { goto, isActive, params } from "@roxi/routify"
  import { BUDIBASE_INTERNAL_DB_ID } from "constants/backend"
  import {
    database,
    datasources,
    queries,
    tables,
    views,
    viewsV2,
  } from "stores/backend"
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
  import { userSelectedResourceMap } from "builderStore"

  export let searchTerm
  let dataSourcesVisibility = {}

  $: enrichedDataSources = enrichDatasources(
    $datasources,
    $params,
    $isActive,
    $tables,
    $queries,
    $views,
    $viewsV2,
    dataSourcesVisibility,
    searchTerm
  )

  const showDatasourceOpen = ({
    selected,
    containsSelected,
    dataSourceVisibility,
    searchTerm,
    onlyOneSource,
  }) => {
    if (searchTerm) {
      return true
    }

    if (dataSourceVisibility !== undefined) {
      return dataSourceVisibility
    }

    if (onlyOneSource) {
      return true
    }

    return selected || containsSelected
  }

  const enrichDatasources = (
    datasources,
    params,
    isActive,
    tables,
    queries,
    views,
    viewsV2,
    dataSourcesVisibility,
    searchTerm
  ) => {
    if (!datasources?.list?.length) {
      return []
    }
    const onlySource = datasources.list.length === 1
    return datasources.list.map(datasource => {
      const selected =
        isActive("./datasource") &&
        datasources.selectedDatasourceId === datasource._id
      const containsSelected = containsActiveEntity(
        datasource,
        params,
        isActive,
        tables,
        queries,
        views,
        viewsV2
      )

      const dsTables = tables.list.filter(
        table =>
          table.sourceId === datasource._id &&
          table._id !== TableNames.USERS &&
          (!searchTerm ||
            table.name?.toLowerCase()?.indexOf(searchTerm.toLowerCase()) > -1)
      )
      const dsQueries = queries.list.filter(
        query =>
          query.datasourceId === datasource._id &&
          (!searchTerm ||
            query.name?.toLowerCase()?.indexOf(searchTerm.toLowerCase()) > -1)
      )

      const open = showDatasourceOpen({
        selected,
        containsSelected,
        dataSourceVisibility: dataSourcesVisibility[datasource._id],
        searchTerm,
        onlyOneSource: onlySource,
      })
      return {
        ...datasource,
        selected,
        containsSelected,
        open,
        queries: dsQueries,
        tables: dsTables,
      }
    })
  }

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
    dataSourcesVisibility[datasource._id] = true
  }

  function toggleNode(datasource) {
    dataSourcesVisibility[datasource._id] = !datasource.open
  }

  const containsActiveEntity = (
    datasource,
    params,
    isActive,
    tables,
    queries,
    views,
    viewsV2
  ) => {
    // Check for being on a datasource page
    if (params.datasourceId === datasource._id) {
      return true
    }

    // Check for hardcoded datasource edge cases
    if (
      isActive("./datasource/bb_internal") &&
      datasource._id === "bb_internal"
    ) {
      return true
    }
    if (
      isActive("./datasource/datasource_internal_bb_default") &&
      datasource._id === "datasource_internal_bb_default"
    ) {
      return true
    }

    // Check for a matching query
    if (params.queryId) {
      const query = queries.list?.find(q => q._id === params.queryId)
      return datasource._id === query?.datasourceId
    }

    // If there are no entities it can't contain anything
    if (!datasource.entities) {
      return false
    }

    // Get a list of table options
    let options = datasource.entities
    if (!Array.isArray(options)) {
      options = Object.values(options)
    }

    // Check for a matching table
    if (params.tableId) {
      const selectedTable = tables.selected?._id
      return options.find(x => x._id === selectedTable) != null
    }

    // Check for a matching view
    const selectedView = views.selected?.name
    const viewTable = options.find(table => {
      return table.views?.[selectedView] != null
    })
    if (viewTable) {
      return true
    }

    // Check for a matching viewV2
    const viewV2Table = options.find(x => x._id === viewsV2.selected?.tableId)
    return viewV2Table != null
  }
</script>

{#if $database?._id}
  <div class="hierarchy-items-container">
    <NavItem
      icon="UserGroup"
      text="App users"
      selected={$isActive("./table/:tableId") &&
        $tables.selected?._id === TableNames.USERS}
      on:click={() => selectTable(TableNames.USERS)}
      selectedBy={$userSelectedResourceMap[TableNames.USERS]}
    />
    {#each enrichedDataSources as datasource}
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
</style>

<script>
  import { goto, isActive, params } from "@roxi/routify"
  import { BUDIBASE_INTERNAL_DB_ID } from "constants/backend"
  import { database, datasources, queries, tables, views } from "stores/backend"
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

  let openDataSources = []
  $: enrichedDataSources = enrichDatasources(
    $datasources,
    $params,
    $isActive,
    $tables,
    $queries,
    $views,
    openDataSources
  )
  $: openDataSource = enrichedDataSources.find(x => x.open)
  $: {
    // Ensure the open datasource is always actually open
    if (openDataSource) {
      openNode(openDataSource)
    }
  }

  const enrichDatasources = (
    datasources,
    params,
    isActive,
    tables,
    queries,
    views,
    openDataSources
  ) => {
    if (!datasources?.list?.length) {
      return []
    }
    return datasources.list.map(datasource => {
      const selected =
        isActive("./datasource") &&
        datasources.selectedDatasourceId === datasource._id
      const open = openDataSources.includes(datasource._id)
      const containsSelected = containsActiveEntity(
        datasource,
        params,
        isActive,
        tables,
        queries,
        views
      )
      const onlySource = datasources.list.length === 1
      return {
        ...datasource,
        selected,
        containsSelected,
        open: selected || open || containsSelected || onlySource,
      }
    })
  }

  function selectDatasource(datasource) {
    openNode(datasource)
    $goto(`./datasource/${datasource._id}`)
  }

  function closeNode(datasource) {
    openDataSources = openDataSources.filter(id => datasource._id !== id)
  }

  function openNode(datasource) {
    if (!openDataSources.includes(datasource._id)) {
      openDataSources = [...openDataSources, datasource._id]
    }
  }

  function toggleNode(datasource) {
    const isOpen = openDataSources.includes(datasource._id)
    if (isOpen) {
      closeNode(datasource)
    } else {
      openNode(datasource)
    }
  }

  const containsActiveEntity = (
    datasource,
    params,
    isActive,
    tables,
    queries,
    views
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
    const table = options.find(table => {
      return table.views?.[selectedView] != null
    })
    return table != null
  }
</script>

{#if $database?._id}
  <div class="hierarchy-items-container">
    {#each enrichedDataSources as datasource, idx}
      <NavItem
        border={idx > 0}
        text={datasource.name}
        opened={datasource.open}
        selected={$isActive("./datasource") && datasource.selected}
        withArrow={true}
        on:click={() => selectDatasource(datasource)}
        on:iconClick={() => toggleNode(datasource)}
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
        <TableNavigator sourceId={datasource._id} />
        {#each $queries.list.filter(query => query.datasourceId === datasource._id) as query}
          <NavItem
            indentLevel={1}
            icon="SQLQuery"
            iconText={customQueryIconText(datasource, query)}
            iconColor={customQueryIconColor(datasource, query)}
            text={customQueryText(datasource, query)}
            selected={$isActive("./query/:queryId") &&
              $queries.selectedQueryId === query._id}
            on:click={() => $goto(`./query/${query._id}`)}
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
    margin: 0 calc(-1 * var(--spacing-xl));
  }
  .datasource-icon {
    display: grid;
    place-items: center;
    flex: 0 0 24px;
  }
</style>

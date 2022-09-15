<script>
  import { onMount } from "svelte"
  import { get } from "svelte/store"
  import { goto, params } from "@roxi/routify"
  import { BUDIBASE_INTERNAL_DB } from "constants"
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
  import { getIcon } from "./icons"
  import { notifications } from "@budibase/bbui"

  let openDataSources = []
  $: enrichedDataSources = Array.isArray($datasources.list)
    ? $datasources.list.map(datasource => {
        const selected = $datasources.selected === datasource._id
        const open = openDataSources.includes(datasource._id)
        const containsSelected = containsActiveEntity(datasource)
        const onlySource = $datasources.list.length === 1
        return {
          ...datasource,
          selected,
          open: selected || open || containsSelected || onlySource,
        }
      })
    : []
  $: openDataSource = enrichedDataSources.find(x => x.open)
  $: {
    // Ensure the open datasource is always included in the list of open
    // datasources
    if (openDataSource) {
      openNode(openDataSource)
    }
  }

  function selectDatasource(datasource) {
    openNode(datasource)
    datasources.select(datasource._id)
    $goto(`./datasource/${datasource._id}`)
  }

  function onClickQuery(query) {
    queries.select(query)
    $goto(`./datasource/${query.datasourceId}/${query._id}`)
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

  onMount(async () => {
    try {
      await datasources.fetch()
      await queries.fetch()
    } catch (error) {
      notifications.error("Error fetching datasources and queries")
    }
  })

  const containsActiveEntity = datasource => {
    // If we're view a query then the datasource ID is in the URL
    if ($params.selectedDatasource === datasource._id) {
      return true
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
    if ($params.selectedTable) {
      const selectedTable = get(tables).selected?._id
      return options.find(x => x._id === selectedTable) != null
    }

    // Check for a matching view
    const selectedView = get(views).selected?.name
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
        selected={datasource.selected}
        withArrow={true}
        on:click={() => selectDatasource(datasource)}
        on:iconClick={() => toggleNode(datasource)}
      >
        <div class="datasource-icon" slot="icon">
          <svelte:component
            this={getIcon(datasource.source, datasource.schema)}
            height="18"
            width="18"
          />
        </div>
        {#if datasource._id !== BUDIBASE_INTERNAL_DB}
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
            opened={$queries.selected === query._id}
            selected={$queries.selected === query._id}
            on:click={() => onClickQuery(query)}
          >
            <EditQueryPopover {query} {onClickQuery} />
          </NavItem>
        {/each}
      {/if}
    {/each}
  </div>
{/if}

<style>
  .datasource-icon {
    display: grid;
    place-items: center;
    flex: 0 0 24px;
  }
</style>

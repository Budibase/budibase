<script>
  import { onMount } from "svelte"
  import { get } from "svelte/store"
  import { goto } from "@roxi/routify"
  import { BUDIBASE_INTERNAL_DB } from "constants"
  import { database, datasources, queries, tables } from "stores/backend"
  import EditDatasourcePopover from "./popovers/EditDatasourcePopover.svelte"
  import EditQueryPopover from "./popovers/EditQueryPopover.svelte"
  import NavItem from "components/common/NavItem.svelte"
  import TableNavigator from "components/backend/TableNavigator/TableNavigator.svelte"
  import ICONS from "./icons"

  let openDataSources = []
  $: enrichedDataSources = $datasources.list.map(datasource => ({
    ...datasource,
    open:
      openDataSources.includes(datasource._id) ||
      containsActiveTable(datasource),
    selected: $datasources.selected === datasource._id,
  }))

  function selectDatasource(datasource) {
    toggleNode(datasource)
    datasources.select(datasource._id)
    $goto(`./datasource/${datasource._id}`)
  }

  function onClickQuery(query) {
    queries.select(query)
    $goto(`./datasource/${query.datasourceId}/${query._id}`)
  }

  function toggleNode(datasource) {
    const isOpen = openDataSources.includes(datasource._id)
    if (isOpen) {
      openDataSources = openDataSources.filter(id => datasource._id !== id)
    } else {
      openDataSources = [...openDataSources, datasource._id]
    }
  }

  onMount(() => {
    datasources.fetch()
    queries.fetch()
  })

  const containsActiveTable = datasource => {
    const activeTableId = get(tables).selected?._id
    if (!datasource.entities) {
      return false
    }
    let tableOptions = datasource.entities
    if (!Array.isArray(tableOptions)) {
      tableOptions = Object.values(tableOptions)
    }
    return tableOptions.find(x => x._id === activeTableId) != null
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
            this={ICONS[datasource.source]}
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
      {/if}

      {#each $queries.list.filter(query => query.datasourceId === datasource._id) as query}
        <NavItem
          indentLevel={1}
          icon="SQLQuery"
          text={query.name}
          opened={$queries.selected === query._id}
          selected={$queries.selected === query._id}
          on:click={() => onClickQuery(query)}
        >
          <EditQueryPopover {query} />
        </NavItem>
      {/each}
    {/each}
  </div>
{/if}

<style>
  .datasource-icon {
    margin-right: 3px;
    padding-top: 3px;
  }
</style>

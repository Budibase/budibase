<script>
  import { onMount } from "svelte"
  import { goto } from "@roxi/routify"
  import { BUDIBASE_INTERNAL_DB } from "constants"
  import { database, datasources, queries } from "stores/backend"
  import EditDatasourcePopover from "./popovers/EditDatasourcePopover.svelte"
  import EditQueryPopover from "./popovers/EditQueryPopover.svelte"
  import NavItem from "components/common/NavItem.svelte"
  import TableNavigator from "components/backend/TableNavigator/TableNavigator.svelte"
  import ICONS from "./icons"

  let openDataSources = []

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
</script>

{#if $database?._id}
  <div class="hierarchy-items-container">
    {#each $datasources.list as datasource, idx}
      <NavItem
        border={idx > 0}
        text={datasource.name}
        opened={openDataSources.includes(datasource._id)}
        selected={$datasources.selected === datasource._id}
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

      {#if openDataSources.includes(datasource._id)}
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

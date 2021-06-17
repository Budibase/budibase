<script>
  import { onMount } from "svelte"
  import { goto } from "@roxi/routify"
  import { BUDIBASE_INTERNAL_DB } from "constants"
  import { database, datasources, queries, tables } from "stores/backend"
  import EditDatasourcePopover from "./popovers/EditDatasourcePopover.svelte"
  import EditQueryPopover from "./popovers/EditQueryPopover.svelte"
  import NavItem from "components/common/NavItem.svelte"
  import TableNavigator from "components/backend/TableNavigator/TableNavigator.svelte"
  import ICONS from "./icons"

  function selectDatasource(datasource) {
    datasources.select(datasource._id)
    $goto(`./datasource/${datasource._id}`)
  }

  function onClickQuery(query) {
    queries.select(query)
    $goto(`./datasource/${query.datasourceId}/${query._id}`)
  }

  function onClickTable(table) {
    tables.select(table)
    $goto(`./table/${table._id}`)
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
        selected={$datasources.selected === datasource._id}
        on:click={() => selectDatasource(datasource)}
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

      <TableNavigator sourceId={datasource._id} />

      {#each $queries.list.filter(query => query.datasourceId === datasource._id) as query}
        <NavItem
          indentLevel={1}
          icon="SQLQuery"
          text={query.name}
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

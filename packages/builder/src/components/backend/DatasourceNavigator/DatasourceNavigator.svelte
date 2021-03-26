<script>
  import { onMount } from "svelte"
  import { goto } from "@sveltech/routify"
  import { database, datasources, queries } from 'stores/backend/'
  import EditDatasourcePopover from "./popovers/EditDatasourcePopover.svelte"
  import EditQueryPopover from "./popovers/EditQueryPopover.svelte"
  import NavItem from "components/common/NavItem.svelte"
  import ICONS from "./icons"

  function selectDatasource(datasource) {
    datasources.select(datasource._id)
    $goto(`./datasource/${datasource._id}`)
  }

  function onClickQuery(query) {
    if ($queries.selected === query._id) {
      return
    }
    queries.select(query)
    $goto(`./datasource/${query.datasourceId}/${query._id}`)
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
        on:click={() => selectDatasource(datasource)}>
        <div class="datasource-icon" slot="icon">
          <svelte:component
            this={ICONS[datasource.source]}
            height="18"
            width="18" />
        </div>
        <EditDatasourcePopover {datasource} />
      </NavItem>
      {#each $queries.list.filter(query => query.datasourceId === datasource._id) as query}
        <NavItem
          indentLevel={1}
          icon="ri-eye-line"
          text={query.name}
          selected={$queries.selected === query._id}
          on:click={() => onClickQuery(query)}>
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

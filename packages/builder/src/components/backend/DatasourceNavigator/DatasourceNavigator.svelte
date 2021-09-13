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
  import { organisation } from "stores/portal"

  function selectDatasource(datasource) {
    datasources.select(datasource._id)
    $goto(`./datasource/${datasource._id}`)
  }

  function onClickQuery(query) {
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
      {#if datasource._id === BUDIBASE_INTERNAL_DB}
        <NavItem
          border={idx > 0}
          text={($organisation.company && $organisation.company + " DB") ||
            datasource.name}
          selected={$datasources.selected === datasource._id}
          on:click={() => selectDatasource(datasource)}
        >
          <div class="datasource-icon" slot="icon">
            {#if $organisation.logoUrl}
              <img height="18" width="18" alt={$organisation.company} src={$organisation.logoUrl} />
            {:else}
              <svelte:component
                this={ICONS[datasource.source]}
                height="18"
                width="18"
              />
            {/if}
          </div>
        </NavItem>
      {:else}
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
          <EditDatasourcePopover {datasource} />
        </NavItem>
      {/if}

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

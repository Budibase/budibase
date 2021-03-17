<script>
  import { onMount } from "svelte"
  import { goto } from "@roxi/routify"
  import { backendUiStore } from "builderStore"
  import EditDatasourcePopover from "./popovers/EditDatasourcePopover.svelte"
  import EditQueryPopover from "./popovers/EditQueryPopover.svelte"
  import NavItem from "components/common/NavItem.svelte"
  import ICONS from "./icons"

  function selectDatasource(datasource) {
    backendUiStore.actions.datasources.select(datasource._id)
    $goto(`./datasource/${datasource._id}`)
  }

  function onClickQuery(query) {
    if ($backendUiStore.selectedQueryId === query._id) {
      return
    }
    backendUiStore.actions.queries.select(query)
    $goto(`./datasource/${query.datasourceId}/${query._id}`)
  }

  onMount(() => {
    backendUiStore.actions.datasources.fetch()
    backendUiStore.actions.queries.fetch()
  })
</script>

{#if $backendUiStore.selectedDatabase && $backendUiStore.selectedDatabase._id}
  <div class="hierarchy-items-container">
    {#each $backendUiStore.datasources as datasource, idx}
      <NavItem
        border={idx > 0}
        text={datasource.name}
        selected={$backendUiStore.selectedDatasourceId === datasource._id}
        on:click={() => selectDatasource(datasource)}>
        <div class="datasource-icon" slot="icon">
          <svelte:component
            this={ICONS[datasource.source]}
            height="18"
            width="18" />
        </div>
        <EditDatasourcePopover {datasource} />
      </NavItem>
      {#each $backendUiStore.queries.filter(query => query.datasourceId === datasource._id) as query}
        <NavItem
          indentLevel={1}
          icon="ri-eye-line"
          text={query.name}
          selected={$backendUiStore.selectedQueryId === query._id}
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

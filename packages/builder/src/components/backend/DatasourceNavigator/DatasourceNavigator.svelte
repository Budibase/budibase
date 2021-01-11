<script>
  import { onMount } from "svelte"
  import { goto } from "@sveltech/routify"
  import { backendUiStore } from "builderStore"
  import { TableNames } from "constants"
  import CreateDatasourceModal from "./modals/CreateDatasourceModal.svelte"
  import EditDatasourcePopover from "./popovers/EditDatasourcePopover.svelte"
  import EditQueryPopover from "./popovers/EditQueryPopover.svelte"
  import { Modal, Switcher } from "@budibase/bbui"
  import NavItem from "components/common/NavItem.svelte"

  $: selectedView =
    $backendUiStore.selectedView && $backendUiStore.selectedView.name

  function selectDatasource(datasource) {
    backendUiStore.actions.datasources.select(datasource._id)
    $goto(`./datasource/${datasource._id}`)
  }

  function onClickQuery(datasourceId, queryId) {
    if ($backendUiStore.selectedQueryId === queryId) {
      return
    }
    backendUiStore.actions.datasources.select(datasourceId)
    backendUiStore.actions.queries.select(queryId)
    $goto(`./datasource/${datasourceId}/${queryId}`)
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
        icon={'ri-database-2-line'}
        text={datasource.name}
        selected={$backendUiStore.selectedDatasourceId === datasource._id}
        on:click={() => selectDatasource(datasource)}>
        <EditDatasourcePopover {datasource} />
      </NavItem>
      {#each $backendUiStore.queries.filter(query => query.datasourceId === datasource._id) as query}
        <NavItem
          indentLevel={1}
          icon="ri-eye-line"
          text={query.name}
          selected={$backendUiStore.selectedQueryId === query._id}
          on:click={() => onClickQuery(datasource._id, query._id)}>
          <EditQueryPopover {query} />
        </NavItem>
      {/each}
    {/each}
  </div>
{/if}

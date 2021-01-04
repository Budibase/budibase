<script>
  import { onMount } from "svelte"
  import { goto } from "@sveltech/routify"
  import { backendUiStore } from "builderStore"
  import { TableNames } from "constants"
  import CreateDatasourceModal from "./modals/CreateDatasourceModal.svelte"
  import EditDatasourcePopover from "./popovers/EditDatasourcePopover.svelte"
  import { Modal, Switcher } from "@budibase/bbui"
  import NavItem from "components/common/NavItem.svelte"

  $: selectedView =
    $backendUiStore.selectedView && $backendUiStore.selectedView.name

  function selectDatasource(datasource) {
    // You can't actually select a datasource, just edit it
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
      {#each Object.keys(datasource.queries) as queryId}
        <NavItem
          indentLevel={1}
          icon="ri-eye-line"
          text={datasource.queries[queryId].name}
          selected={$backendUiStore.selectedQueryId === queryId}
          on:click={() => onClickQuery(datasource._id, queryId)}>
          <!-- <EditViewPopover
            view={{ name: viewName, ...table.views[viewName] }} /> -->
        </NavItem>
      {/each}
    {/each}
  </div>
{/if}

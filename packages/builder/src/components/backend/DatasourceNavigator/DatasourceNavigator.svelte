<script>
  import { onMount } from "svelte"
  import { goto } from "@sveltech/routify"
  import { backendUiStore } from "builderStore"
  import { TableNames } from "constants"
  import CreateDatasourceModal from "./modals/CreateDatasourceModal.svelte"
  import EditDatasourcePopover from "./popovers/EditDatasourcePopover.svelte"
  import { Modal, Switcher } from "@budibase/bbui"
  import NavItem from "components/common/NavItem.svelte"

  let modal

  $: selectedView =
    $backendUiStore.selectedView && $backendUiStore.selectedView.name

  function selectDatasource(datasource) {
    // You can't actually select a datasource, just edit it
    backendUiStore.actions.datasources.select(datasource)
    $goto(`./datasource/${datasource._id}`)
  }

  function onClickQuery(datasourceId, queryId) {
    if ($backendUiStore.selectedQueryId === queryId) {
      return
    }
    backendUiStore.actions.queries.select(queryId)
    $goto(`./datasource/${datasourceId}/${queryId}`)
  }

  onMount(() => {
    backendUiStore.actions.datasources.fetch()
  })
</script>

{#if $backendUiStore.selectedDatabase && $backendUiStore.selectedDatabase._id}
  <div class="title">
    <i
      data-cy="new-datasource"
      on:click={modal.show}
      class="ri-add-circle-fill" />
  </div>
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
          selected={selectedView === queryId}
          on:click={() => onClickQuery(datasource._id, queryId)}>
          <!-- <EditViewPopover
            view={{ name: viewName, ...table.views[viewName] }} /> -->
        </NavItem>
      {/each}
    {/each}
  </div>
{/if}
<Modal bind:this={modal}>
  <CreateDatasourceModal />
</Modal>

<style>
  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .title i {
    font-size: 20px;
  }
  .title i:hover {
    cursor: pointer;
    color: var(--blue);
  }
</style>

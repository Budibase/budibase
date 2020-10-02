<script>
  import ModelDataTable from "components/backend/DataTable/ModelDataTable.svelte"
  import { backendUiStore } from "builderStore"

  $: selectedModel = $backendUiStore.selectedModel
</script>

{#if $backendUiStore.selectedDatabase._id && selectedModel.name}
  <ModelDataTable />
{:else}
  <i>Create your first table to start building</i>
{/if}

<style>
  i {
    font-size: var(--font-size-xl);
    color: var(--grey-4);
  }
</style>

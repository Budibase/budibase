<script>
<<<<<<< HEAD:packages/builder/src/pages/builder/[application]/data/view/[selectedView]/index.svelte
  import ViewDataTable from "components/backend/DataTable/ViewDataTable.svelte"
  import { backendUiStore } from "builderStore"
=======
  import ViewDataTable from "components/backend/DataTable/ViewDataTable"
  import { views, database } from 'stores/backend/'
>>>>>>> d803aa0bd7a74220e432f4a1b338abdd7fbe9b7d:packages/builder/src/pages/[application]/data/view/[selectedView]/index.svelte

  $: selectedView = $views.selected
</script>

{#if $database._id && selectedView}
  <ViewDataTable view={selectedView} />
{:else}<i>Create your first table to start building</i>{/if}

<style>
  i {
    font-size: var(--font-size-m);
    color: var(--grey-4);
    margin-top: 2px;
  }
</style>

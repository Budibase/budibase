<script>
    import { backendUiStore } from "builderStore"
    import { goto, leftover } from "@sveltech/routify"
    import { onMount } from "svelte"

    onMount(async () => {
      // navigate to first table in list, if not already selected
      // and this is the final url (i.e. no selectedTable)
      if (
        !$leftover &&
        $backendUiStore.datasources.length > 0 && !$backendUiStore.selectedDatasourceId
      ) {
        // this file routes as .../tables/index, so, go up one.
        $goto(`../${$backendUiStore.datasources[0]._id}`)
      }
    })
  </script>
  
  {#if $backendUiStore.tables.length === 0}
    <i>Connect your first datasource to start building.</i>
  {:else}<i>Select a datasource to edit</i>{/if}
  
  <style>
    i {
      font-size: var(--font-size-m);
      color: var(--grey-5);
      margin-top: 2px;
    }
  </style>
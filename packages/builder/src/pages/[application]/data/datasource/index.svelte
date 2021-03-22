<script>
    import { backendUiStore } from "builderStore"
    import { datasources } from 'builderStore/store/backend/'
    import { goto } from "@sveltech/routify"
    import { onMount } from "svelte"

    onMount(async () => {
      // navigate to first table in list, if not already selected
      $datasources.sources.length > 0 && $goto(`../${$datasources.sources[0]._id}`)
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
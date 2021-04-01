<script>
<<<<<<< HEAD:packages/builder/src/pages/builder/[application]/data/datasource/index.svelte
  import { backendUiStore } from "builderStore"
  import { goto } from "@roxi/routify"
  import { onMount } from "svelte"

  onMount(async () => {
    // navigate to first table in list, if not already selected
    $backendUiStore.datasources.length > 0 &&
      $goto(`./${$backendUiStore.datasources[0]._id}`)
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
=======
    import { datasources, tables } from 'stores/backend/'
    import { goto } from "@sveltech/routify"
    import { onMount } from "svelte"

    onMount(async () => {
      // navigate to first table in list, if not already selected
      $datasources.list.length > 0 && $goto(`../${$datasources.list[0]._id}`)
    })
  </script>
  
  {#if $tables.list.length === 0}
    <i>Connect your first datasource to start building.</i>
  {:else}<i>Select a datasource to edit</i>{/if}
  
  <style>
    i {
      font-size: var(--font-size-m);
      color: var(--grey-5);
      margin-top: 2px;
    }
  </style>
>>>>>>> d803aa0bd7a74220e432f4a1b338abdd7fbe9b7d:packages/builder/src/pages/[application]/data/datasource/index.svelte

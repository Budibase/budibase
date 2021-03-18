<script>
  import { backendUiStore } from "builderStore"
  import { goto } from "@sveltech/routify"
  import { onMount } from "svelte"

  onMount(async () => {
    $backendUiStore.tables.length > 0 && $goto(`../${$backendUiStore.tables[0]._id}`)
  })
</script>

{#if $backendUiStore.tables.length === 0}
  <i>Create your first table to start building</i>
{:else}<i>Select a table to edit</i>{/if}

<style>
  i {
    font-size: var(--font-size-m);
    color: var(--grey-5);
    margin-top: 2px;
  }
</style>

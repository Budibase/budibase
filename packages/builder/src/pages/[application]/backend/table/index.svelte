<script>
  import { store, backendUiStore } from "builderStore"
  import { goto, leftover } from "@sveltech/routify"
  import { onMount } from "svelte"

  async function selectTable(table) {
    backendUiStore.actions.tables.select(table)
  }

  onMount(async () => {
    // navigate to first table in list, if not already selected
    // and this is the final url (i.e. no selectedTable)
    if (
      !$leftover &&
      $backendUiStore.tables.length > 0 &&
      (!$backendUiStore.selectedTable || !$backendUiStore.selectedTable._id)
    ) {
      // this file routes as .../tables/index, so, go up one.
      $goto(`../${$backendUiStore.tables[0]._id}`)
    }
  })
</script>

{#if $backendUiStore.tables.length === 0}
  <i>Create your first table to start building</i>
{:else}
  <i>Select a table to edit</i>
{/if}

<style>
  i {
    font-size: var(--font-size-xl);
    color: var(--grey-4);
  }
</style>

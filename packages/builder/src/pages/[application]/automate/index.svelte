<script>
  import { onMount } from 'svelte'
  import { automationStore } from "builderStore"

  $: automationCount = $automationStore.automations?.length ?? 0

  onMount(async () => {
    console.log('Automation Store: ', $automationStore)
    console.log('Automation Store Methods: ', automationStore)
    // navigate to first automation in list, if not already selected
    // if (
    //   !$leftover &&
    //   $backendUiStore.tables.length > 0 &&
    //   (!$backendUiStore.selectedTable || !$backendUiStore.selectedTable._id)
    // ) {
    //   // this file routes as .../tables/index, so, go up one.
    //   $goto(`../${$backendUiStore.tables[0]._id}`)
    // }
  })
</script>


{#if automationCount === 0}
  <i>Create your first automation to get started</i>
{:else}<i>Select an automation to edit</i>{/if}

<style>
  i {
    font-size: var(--font-size-m);
    color: var(--grey-5);
    margin-top: 2px;
  }
</style>

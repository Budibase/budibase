<script>
  import { onMount } from 'svelte'
  import { automationStore } from "builderStore"
  import AutomationBuilder from "components/automation/AutomationBuilder/AutomationBuilder.svelte"

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

<AutomationBuilder />

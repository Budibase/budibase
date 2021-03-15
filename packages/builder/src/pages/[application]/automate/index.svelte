<script>
  import { goto, leftover } from "@sveltech/routify"
  import { onMount } from 'svelte'
  import { automationStore } from "builderStore"

  $: automationCount = $automationStore.automations?.length ?? 0

  onMount(async () => {
      // navigate to first automation in list, if not already selected
      if (
        !$leftover &&
        $automationStore.automations.length > 0 &&
        (!$automationStore.selectedAutomation || !$automationStore.selectedAutomation?.automation?._id)
      ) {
        $goto(`../${$automationStore.automations[0]._id}`)
      }
    })
</script>


{#if automationCount === 0}
  <i>Create your first automation to get started</i>
{:else}<i>Select an automation to edit</i>{/if}


<script>
  import { goto, leftover } from "@roxi/routify"
  import { onMount } from 'svelte'
  import { automationStore } from "builderStore"

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

<i>Create your first automation to get started</i>

<style>
  i {
    font-size: var(--font-size-m);
    color: var(--grey-5);
    margin-top: 2px;
  }
</style>
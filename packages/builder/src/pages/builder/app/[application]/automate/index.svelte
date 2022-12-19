<script>
  import { redirect, leftover } from "@roxi/routify"
  import { onMount } from "svelte"
  import { automationStore } from "builderStore"

  onMount(async () => {
    // navigate to first automation in list, if not already selected
    if (
      !$leftover &&
      $automationStore.automations.length > 0 &&
      (!$automationStore.selectedAutomation ||
        !$automationStore.selectedAutomation?.automation?._id)
    ) {
      $redirect(`./${$automationStore.automations[0]._id}`)
    }
  })
</script>

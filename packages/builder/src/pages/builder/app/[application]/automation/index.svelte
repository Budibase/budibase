<script>
  import { redirect } from "@roxi/routify"
  import { automationStore } from "@/stores/builder"

  $: {
    if ($automationStore.selectedAutomationId) {
      $redirect(`./${$automationStore.selectedAutomationId}`)
    } else if ($automationStore.automations?.length) {
      $redirect(`./${$automationStore.automations[0]._id}`)
    }
  }
</script>

<script>
  import { redirect } from "@roxi/routify"
  import { automationStore } from "@/stores/builder"

  $: {
    if ($automationStore.automations?.length) {
      $redirect(`./${$automationStore.automations[0]._id}`)
    }
  }
</script>

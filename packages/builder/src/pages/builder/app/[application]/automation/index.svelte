<script>
  import { redirect } from "@roxi/routify"
  import { automationStore } from "stores/frontend"

  $: {
    if ($automationStore.automations?.length) {
      $redirect(`./${$automationStore.automations[0]._id}`)
    }
  }
</script>

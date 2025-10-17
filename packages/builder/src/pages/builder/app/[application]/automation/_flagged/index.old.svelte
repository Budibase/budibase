<script>
  import { redirect } from "@roxi/routify"
  import { automationStore } from "@/stores/builder"

  // Workaround for Routify 2 + Svelte 5 compatibility
  // See: https://github.com/roxiness/routify/issues/563
  $redirect

  $: {
    if ($automationStore.automations?.length) {
      $redirect(`./${$automationStore.automations[0]._id}`)
    }
  }
</script>

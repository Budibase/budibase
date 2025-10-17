<script>
  import { automationStore } from "@/stores/builder"
  import { params } from "@roxi/routify"

  // Workaround for Routify 2 + Svelte 5 compatibility
  // See: https://github.com/roxiness/routify/issues/563
  $params

  if ($params.automation) {
    const automation = $automationStore.automations.find(
      m => m._id === $params.automation
    )
    if (automation) {
      automationStore.actions.select(automation)
    }
  }
</script>

<slot />

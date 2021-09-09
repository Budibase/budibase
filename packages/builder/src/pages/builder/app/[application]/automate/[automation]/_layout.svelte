<script>
  import { automationStore } from "builderStore"
  import { params } from "@roxi/routify"

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

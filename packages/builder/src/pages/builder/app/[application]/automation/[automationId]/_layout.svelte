<script>
import { params } from "@roxi/routify"
import { automationStore } from "stores/builder"

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

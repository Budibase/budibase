<script>
import { params } from "@sveltech/routify"
import { backendUiStore } from "builderStore"

if ($params.selectedModel) {
  const model = $backendUiStore.models.find(m => m._id === $params.selectedModel)
  if (model) {
    backendUiStore.actions.models.select(model)
  }
}

</script>

<slot />

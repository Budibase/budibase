<script>
  import { params } from "@roxi/routify"
  import { backendUiStore } from "builderStore"

  if ($params.query) {
    const query = $backendUiStore.queries.find(m => m._id === $params.query)
    if (query) {
      backendUiStore.actions.queries.select(query)
    }
  }
</script>

<slot />

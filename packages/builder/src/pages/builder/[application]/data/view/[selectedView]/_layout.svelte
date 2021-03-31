<script>
  import { params } from "@roxi/routify"
  import { backendUiStore } from "builderStore"

  if ($params.selectedView) {
    let view
    const viewName = decodeURI($params.selectedView)
    for (let table of $backendUiStore.tables) {
      if (table.views && table.views[viewName]) {
        view = table.views[viewName]
      }
    }
    if (view) {
      backendUiStore.actions.views.select({
        name: viewName,
        ...view,
      })
    }
  }
</script>

<slot />

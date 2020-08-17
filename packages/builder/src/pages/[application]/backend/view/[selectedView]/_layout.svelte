<script>
  import { params } from "@sveltech/routify"
  import { backendUiStore } from "builderStore"

  if ($params.selectedView) {
    let view
    const viewName = decodeURI($params.selectedView)
    for (let model of $backendUiStore.models) {
      if (model.views && model.views[viewName]) {
        view = model.views[viewName]
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

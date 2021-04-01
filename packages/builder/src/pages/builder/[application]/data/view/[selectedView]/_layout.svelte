<script>
<<<<<<< HEAD:packages/builder/src/pages/builder/[application]/data/view/[selectedView]/_layout.svelte
  import { params } from "@roxi/routify"
  import { backendUiStore } from "builderStore"
=======
  import { params } from "@sveltech/routify"
  import { tables, views } from 'stores/backend/'
>>>>>>> d803aa0bd7a74220e432f4a1b338abdd7fbe9b7d:packages/builder/src/pages/[application]/data/view/[selectedView]/_layout.svelte

  if ($params.selectedView) {
    let view
    const viewName = decodeURI($params.selectedView)
    for (let table of $tables.list) {
      if (table.views && table.views[viewName]) {
        view = table.views[viewName]
      }
    }
    if (view) {
      views.select({
        name: viewName,
        ...view,
      })
    }
  }
</script>

<slot />

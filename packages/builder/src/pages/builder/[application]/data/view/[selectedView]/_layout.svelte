<script>
  import { params } from "@roxi/routify"
  import { tables, views } from "stores/backend"

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

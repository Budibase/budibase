<script>
  import { params } from "@sveltech/routify"
  import { tables, views } from 'builderStore/store/backend/'

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

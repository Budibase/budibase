<script>
<<<<<<< HEAD:packages/builder/src/pages/builder/[application]/data/datasource/[selectedDatasource]/[query]/_layout.svelte
  import { params } from "@roxi/routify"
  import { backendUiStore } from "builderStore"
=======
  import { params } from "@sveltech/routify"
  import { queries } from "stores/backend/"
>>>>>>> d803aa0bd7a74220e432f4a1b338abdd7fbe9b7d:packages/builder/src/pages/[application]/data/datasource/[selectedDatasource]/[query]/_layout.svelte

  if ($params.query) {
    const query = $queries.list.find(
      m => m._id === $params.query
    )
    if (query) {
      queries.select(query)
    }
  }
</script>

<slot />

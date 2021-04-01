<script>
<<<<<<< HEAD:packages/builder/src/pages/builder/[application]/data/table/[selectedTable]/_layout.svelte
  import { params } from "@roxi/routify"
  import { backendUiStore } from "builderStore"
=======
  import { params } from "@sveltech/routify"
  import { tables } from 'stores/backend/'
>>>>>>> d803aa0bd7a74220e432f4a1b338abdd7fbe9b7d:packages/builder/src/pages/[application]/data/table/[selectedTable]/_layout.svelte

  if ($params.selectedTable) {
    const table = $tables.list.find(
      m => m._id === $params.selectedTable
    )
    if (table) {
      tables.select(table)
    }
  }
</script>

<slot />

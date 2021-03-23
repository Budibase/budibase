<script>
  import { params } from "@sveltech/routify"
  import { tables } from 'builderStore/store/backend/'

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

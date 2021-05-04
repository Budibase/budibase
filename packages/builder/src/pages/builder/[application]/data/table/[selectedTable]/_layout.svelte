<script>
  import { params } from "@roxi/routify"
  import { tables } from "stores/backend"

  if ($params.selectedTable) {
    const table = $tables.list.find(m => m._id === $params.selectedTable)
    if (table) {
      tables.select(table)
    }
  }
</script>

<slot />

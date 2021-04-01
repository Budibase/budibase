<script>
  import { params } from "@roxi/routify"
  import { queries } from "stores/backend"

  if ($params.query) {
    const query = $queries.list.find(m => m._id === $params.query)
    if (query) {
      queries.select(query)
    }
  }
</script>

<slot />

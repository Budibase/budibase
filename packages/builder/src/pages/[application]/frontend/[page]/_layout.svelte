<script>
  import { params } from "@sveltech/routify"
  import { store } from "builderStore"

  store.setCurrentPage($params.page)
</script>

<slot />

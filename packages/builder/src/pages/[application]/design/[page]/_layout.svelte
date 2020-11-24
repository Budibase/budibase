<script>
  import { params } from "@sveltech/routify"
  import { store } from "builderStore"

  store.actions.layouts.select($params.page)
</script>

<slot />

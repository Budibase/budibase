<script>
  import { params } from "@sveltech/routify"
  import { store } from "builderStore"

  store.actions.pages.select($params.page)
</script>

<slot />

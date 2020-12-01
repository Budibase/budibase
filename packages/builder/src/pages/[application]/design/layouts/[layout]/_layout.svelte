<script>
  import { params } from "@sveltech/routify"
  import { store } from "builderStore"

  store.actions.layouts.select($params.layout)
</script>

<slot />

<script>
  import { store } from "builderStore"
  import { params } from "@sveltech/routify"

  store.actions.layouts.select($params.layout)
</script>

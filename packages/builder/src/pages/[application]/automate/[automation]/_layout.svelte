<script>
  import { store } from "builderStore"
  import { params } from "@roxi/routify"

  store.actions.layouts.select($params.layout)
</script>

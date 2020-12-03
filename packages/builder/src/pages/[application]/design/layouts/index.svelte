<script>
  import { store } from "builderStore"
  import { goto } from "@sveltech/routify"

  // TODO: refactor
  $goto(`../${$store.layouts[0]?._id}`)
</script>

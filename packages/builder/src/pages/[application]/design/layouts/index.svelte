<script>
  import { store } from "builderStore"
  import { goto } from "@sveltech/routify"

  // Go to first layout
  $goto(`../${$store.layouts[0]?._id}`)
</script>

<!-- routify:options index=false -->
<script>
  import { goto } from "@sveltech/routify"
  import { params, leftover } from "@sveltech/routify"
  import { allScreens } from "builderStore"

  $goto(`../${$allScreens[0]?._id}`)
</script>

<!-- routify:options index=false -->
<script>
  import { redirect } from "@roxi/routify"
  import { store } from "builderStore"

  $redirect(`./${$store.selectedScreenId}-screen`)
</script>

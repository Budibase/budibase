<script>
  import { redirect } from "@roxi/routify"
  import { screenStore } from "stores/frontend"

  $redirect(`./${$screenStore.selectedScreenId}-screen`)
</script>

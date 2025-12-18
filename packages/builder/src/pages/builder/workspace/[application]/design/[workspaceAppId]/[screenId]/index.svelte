<script>
  import { redirect } from "@roxi/routify"
  import { screenStore } from "@/stores/builder"

  $redirect(`./${$screenStore.selectedScreenId}-screen`)
</script>

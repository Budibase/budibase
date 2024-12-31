<script>
  import { redirect } from "@roxi/routify"
  import { screenStore } from "@/stores/builder"

  $: {
    if ($screenStore.screens.length > 0) {
      $redirect(`./${$screenStore.screens[0]._id}`)
    } else {
      $redirect("./new")
    }
  }
</script>

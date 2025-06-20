<script lang="ts">
  import { screenStore, selectedScreen } from "@/stores/builder"
  import { redirect } from "@roxi/routify"

  $: {
    if ($selectedScreen) {
      $redirect(`./${$selectedScreen._id}`)
    } else if ($screenStore.screens.length > 0) {
      $redirect(`./${$screenStore.screens[0]._id}`)
    } else {
      $redirect("./new")
    }
  }
</script>

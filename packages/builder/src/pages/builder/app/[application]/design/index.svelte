<script>
  import { redirect } from "@roxi/routify"
  import { store as frontendStore } from "builderStore"

  $: {
    if ($frontendStore.screens.length > 0) {
      $redirect(`./${$frontendStore.screens[0]._id}`)
    } else {
      $redirect("./new")
    }
  }
</script>

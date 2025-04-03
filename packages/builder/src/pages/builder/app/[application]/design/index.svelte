<script>
  import { redirect } from "@roxi/routify"
  import { screenStore } from "@/stores/builder"

  const app = "app_default"

  $: {
    if ($screenStore.screens.length > 0) {
      $redirect(`./${app}/${$screenStore.screens[0]._id}`)
    } else {
      $redirect(`./${app}/new`)
    }
  }
</script>

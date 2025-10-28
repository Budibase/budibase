<script>
  import { redirect } from "@roxi/routify"
  import { screenStore, appStore } from "@/stores/builder"
  import { onMount } from "svelte"

  onMount(() => {
    const { screens } = $screenStore
    const { appId } = $appStore
    if (!appId) return
    if (screens && screens.length > 0) {
      $redirect("./design")
    } else {
      $redirect("./data")
    }
  })
</script>

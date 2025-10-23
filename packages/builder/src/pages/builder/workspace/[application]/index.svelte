<script>
  import { redirect } from "@roxi/routify"
  import { screenStore } from "@/stores/builder"
  import { onMount } from "svelte"

  onMount(() => {
    const { screens } = $screenStore

    if (screens && screens.length > 0) {
      $redirect("./design")
    } else {
      $redirect("./data")
    }
  })
</script>

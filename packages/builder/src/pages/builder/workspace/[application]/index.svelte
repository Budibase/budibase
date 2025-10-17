<script>
  import { redirect } from "@roxi/routify"
  import { screenStore } from "@/stores/builder"
  import { onMount } from "svelte"

  // Workaround for Routify 2 + Svelte 5 compatibility
  // See: https://github.com/roxiness/routify/issues/563
  $redirect

  onMount(() => {
    const { screens } = $screenStore

    if (screens && screens.length > 0) {
      $redirect("./design")
    } else {
      $redirect("./data")
    }
  })
</script>

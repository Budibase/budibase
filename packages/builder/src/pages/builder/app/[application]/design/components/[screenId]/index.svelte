<script>
  import { selectedScreen } from "builderStore"
  import { onMount } from "svelte"
  import { redirect } from "@roxi/routify"

  onMount(() => {
    if ($selectedScreen) {
      // Select the screen slot if a screen exists
      $redirect(`./${$selectedScreen.props._id}`)
    } else {
      // Otherwise go up so we can select a new valid screen
      $redirect("../")
    }
  })
</script>

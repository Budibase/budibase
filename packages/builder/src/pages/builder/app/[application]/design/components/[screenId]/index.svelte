<script>
  import { selectedScreen, selectedComponent } from "builderStore"
  import { onMount } from "svelte"
  import { redirect } from "@roxi/routify"

  onMount(() => {
    if ($selectedComponent) {
      // Navigate to the selected component if one exists
      $redirect(`./${$selectedComponent._id}`)
    } else if ($selectedScreen) {
      // Otherwise the screen slot if a screen exists
      $redirect(`./${$selectedScreen.props._id}`)
    } else {
      // Otherwise go up so we can select a new valid screen
      $redirect("../")
    }
  })
</script>

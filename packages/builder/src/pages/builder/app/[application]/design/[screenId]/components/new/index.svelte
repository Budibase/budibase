<script>
  import NewComponentPanel from "./_components/NewComponentPanel.svelte"
  import NewComponentTargetPanel from "./_components/NewComponentTargetPanel.svelte"
  import { onMount } from "svelte"
  import { store, selectedComponent, selectedScreen } from "builderStore"
  import { redirect } from "@roxi/routify"

  // Select the screen slot as the target to add to, if no component
  // is selected
  onMount(() => {
    if (!$selectedComponent) {
      if ($selectedScreen) {
        store.update(state => {
          state.selectedComponentId = $selectedScreen.props._id
          return state
        })
      } else {
        // Otherwise go back out of the add screen
        $redirect("../")
      }
    }
  })
</script>

<NewComponentPanel />
<NewComponentTargetPanel />

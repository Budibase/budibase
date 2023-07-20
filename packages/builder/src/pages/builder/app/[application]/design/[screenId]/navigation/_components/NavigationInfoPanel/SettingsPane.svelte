<script>
  import Pane from "components/design/Pane.svelte"
  import { get } from "svelte/store"
  import { Toggle, Body } from "@budibase/bbui"
  import { selectedScreen, store } from "builderStore"

  const updateShowNavigation = async e => {
    await store.actions.screens.updateSetting(
      get(selectedScreen),
      "showNavigation",
      e.detail
    )
  }
</script>

<Pane title="Settings">
  <div class="toggle">
    <Toggle
      on:change={updateShowNavigation}
      value={$selectedScreen.showNavigation}
    />
    <Body size="S">Show nav on this screen</Body>
  </div>
</Pane>

<style>
  .toggle {
    display: flex;
    align-items: center;
  }
</style>

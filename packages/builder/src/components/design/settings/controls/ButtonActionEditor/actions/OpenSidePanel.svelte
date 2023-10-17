<script>
  import { Select, Label } from "@budibase/bbui"
  import { selectedScreen } from "builderStore"
  import { findAllMatchingComponents } from "builderStore/componentUtils"

  export let parameters

  $: sidePanelOptions = getSidePanelOptions($selectedScreen)

  const getSidePanelOptions = screen => {
    const sidePanelComponents = findAllMatchingComponents(
      screen.props,
      component => component._component.endsWith("/sidepanel")
    )
    return sidePanelComponents.map(sidePanel => ({
      label: sidePanel._instanceName,
      value: sidePanel._id,
    }))
  }
</script>

<div class="root">
  <Label small>Side Panel</Label>
  <Select bind:value={parameters.id} options={sidePanelOptions} />
</div>

<style>
  .root {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 60px 1fr;
    align-items: center;
    max-width: 400px;
    margin: 0 auto;
  }
</style>

<script>
  import { Select, Label } from "@budibase/bbui"
  import { selectedScreen } from "@/stores/builder"
  import { findAllMatchingComponents } from "@/helpers/components"

  export let parameters

  $: sidePanelOptions = getSidePanelOptions($selectedScreen)

  const sizeOptions = [
    { label: "Small", value: "small" },
    { label: "Medium", value: "medium" },
    { label: "Large", value: "large" },
    { label: "Fullscreen", value: "fullscreen" },
  ]

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
  <Label small>Size</Label>
  <Select bind:value={parameters.size} options={sizeOptions} />
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

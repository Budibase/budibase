<script>
  import { Select, Label } from "@budibase/bbui"
  import { selectedScreen } from "@/stores/builder"
  import InfoDisplay from "@/pages/builder/workspace/[application]/design/[workspaceAppId]/[screenId]/[componentId]/_components/Component/InfoDisplay.svelte"
  import {
    findAllMatchingComponents,
    findComponent,
  } from "@/helpers/components"

  export let parameters

  $: sidePanelOptions = getSidePanelOptions($selectedScreen)

  const sizeOptions = [
    { label: "Default", value: ":default" },
    { label: "Small", value: "small" },
    { label: "Medium", value: "medium" },
    { label: "Large", value: "large" },
    { label: "Fullscreen", value: "fullscreen" },
  ]

  // If a side panel component already has a size configured, default the action
  // size to ":default" so it inherits the component setting.
  $: if (parameters?.id) {
    const sidePanel = findComponent($selectedScreen?.props, parameters.id)
    const hasComponentSize = sidePanel?.size != null
    if (hasComponentSize && !parameters.size) {
      parameters.size = ":default"
    }
  }

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
  <div class="size-info">
    <InfoDisplay
      title="SIDE PANEL SIZE"
      body="This overrides the side panel size when specified. Set to &quot;Default&quot; to use the size specified in the side panel's settings."
    />
  </div>
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
  .size-info {
    grid-column: 1 / -1;
  }
</style>

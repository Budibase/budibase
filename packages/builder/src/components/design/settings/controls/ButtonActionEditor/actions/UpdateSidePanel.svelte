<script>
  import { Select, Label } from "@budibase/bbui"
  import { onMount } from "svelte"
  import { selectedScreen } from "builderStore"
  import { findAllMatchingComponents } from "builderStore/componentUtils"

  export let parameters

  const typeOptions = [
    {
      label: "Show side panel",
      value: "show",
    },
    {
      label: "Hide side panel",
      value: "hide",
    },
  ]

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

  onMount(() => {
    if (!parameters.type) {
      parameters.type = "show"
    }
  })
</script>

<div class="root">
  <Label small>Type</Label>
  <Select
    placeholder={null}
    bind:value={parameters.type}
    options={typeOptions}
  />
  {#if parameters.type === "show"}
    <Label small>Side Panel</Label>
    <Select bind:value={parameters.id} options={sidePanelOptions} />
  {/if}
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

<script>
  import { selectedScreen, componentStore } from "@/stores/builder"
  import { Label, Combobox, Select } from "@budibase/bbui"
  import { getActionProviders, buildFormSchema } from "@/dataBinding"
  import { findComponent } from "@/helpers/components"

  export let parameters
  export let nested

  $: formComponent = getFormComponent(
    $selectedScreen.props,
    parameters.componentId
  )
  $: formSchema = buildFormSchema(formComponent)
  $: fieldOptions = Object.keys(formSchema || {})
  $: actionProviders = getActionProviders(
    $selectedScreen,
    $componentStore.selectedComponentId,
    "ScrollTo",
    { includeSelf: nested }
  )

  const getFormComponent = (asset, id) => {
    let component = findComponent(asset, id)
    if (component) {
      return component
    }
    // Check for block component IDs, and use the block itself instead
    if (id?.includes("-")) {
      return findComponent(asset, id.split("-")[0])
    }
    return null
  }
</script>

<div class="root">
  <Label small>Form</Label>
  <Select
    bind:value={parameters.componentId}
    options={actionProviders}
    getOptionLabel={x => x.readableBinding}
    getOptionValue={x => x.runtimeBinding}
  />
  <Label small>Field</Label>
  <Combobox bind:value={parameters.field} options={fieldOptions} />
</div>

<style>
  .root {
    display: grid;
    align-items: center;
    gap: var(--spacing-m);
    grid-template-columns: auto;
    max-width: 400px;
    margin: 0 auto;
  }
</style>

<script>
  import { currentAsset, componentStore } from "stores/frontend"
  import { Label, Combobox, Select } from "@budibase/bbui"
  import {
    getActionProviderComponents,
    buildFormSchema,
  } from "builder/dataBinding"
  import { findComponent } from "stores/frontend/components/utils"

  export let parameters

  $: formComponent = findComponent($currentAsset.props, parameters.componentId)
  $: formSchema = buildFormSchema(formComponent)
  $: fieldOptions = Object.keys(formSchema || {})
  $: actionProviders = getActionProviderComponents(
    $currentAsset,
    $componentStore.selectedComponentId,
    "ScrollTo"
  )
</script>

<div class="root">
  <Label small>Form</Label>
  <Select
    bind:value={parameters.componentId}
    options={actionProviders}
    getOptionLabel={x => x._instanceName}
    getOptionValue={x => x._id}
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

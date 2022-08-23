<script>
  import { Select, Label, Combobox } from "@budibase/bbui"
  import { onMount } from "svelte"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import { currentAsset, store } from "builderStore"
  import {
    getActionProviderComponents,
    buildFormSchema,
  } from "builderStore/dataBinding"
  import { findComponent } from "builderStore/componentUtils"

  export let parameters
  export let bindings = []

  const typeOptions = [
    {
      label: "Set value",
      value: "set",
    },
    {
      label: "Reset to default value",
      value: "reset",
    },
  ]

  $: formComponent = findComponent($currentAsset.props, parameters.componentId)
  $: formSchema = buildFormSchema(formComponent)
  $: fieldOptions = Object.keys(formSchema || {})
  $: actionProviders = getActionProviderComponents(
    $currentAsset,
    $store.selectedComponentId,
    "ValidateForm"
  )

  onMount(() => {
    if (!parameters.type) {
      parameters.type = "set"
    }
  })
</script>

<div class="root">
  <Label small>Form</Label>
  <Select
    bind:value={parameters.componentId}
    options={actionProviders}
    getOptionLabel={x => x._instanceName}
    getOptionValue={x => x._id}
  />
  <Label small>Type</Label>
  <Select
    placeholder={null}
    bind:value={parameters.type}
    options={typeOptions}
  />
  <Label small>Field</Label>
  <Combobox bind:value={parameters.field} options={fieldOptions} />
  {#if parameters.type === "set"}
    <Label small>Value</Label>
    <DrawerBindableInput
      {bindings}
      value={parameters.value}
      on:change={e => (parameters.value = e.detail)}
    />
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

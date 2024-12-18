<script>
  import { Select, Label, Combobox } from "@budibase/bbui"
  import { onMount } from "svelte"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"
  import { selectedScreen, componentStore } from "@/stores/builder"
  import { getActionProviders, buildFormSchema } from "@/dataBinding"
  import { findComponent } from "@/helpers/components"

  export let parameters
  export let bindings = []
  export let nested

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

  $: formComponent = getFormComponent(
    $selectedScreen.props,
    parameters.componentId
  )
  $: formSchema = buildFormSchema(formComponent)
  $: fieldOptions = Object.keys(formSchema || {})
  $: actionProviders = getActionProviders(
    $selectedScreen,
    $componentStore.selectedComponentId,
    "ValidateForm",
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
    getOptionLabel={x => x.readableBinding}
    getOptionValue={x => x.runtimeBinding}
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
      title="Field value"
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

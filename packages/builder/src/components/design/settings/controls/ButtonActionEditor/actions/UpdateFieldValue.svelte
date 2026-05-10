<script>
  import { Select, Label, Multiselect } from "@budibase/bbui"
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

  const handleFieldChange = e => {
    // Convert from single field to multi-select format
    parameters.fields = e.detail || []
    // Initialize fieldValues for new fields
    if (!parameters.fieldValues) {
      parameters.fieldValues = {}
    }
  }

  const handleFieldValueChange = (fieldName, value) => {
    if (!parameters.fieldValues) {
      parameters.fieldValues = {}
    }
    parameters.fieldValues[fieldName] = value
    // Trigger reactivity
    parameters = parameters
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
  <Label small>Type</Label>
  <Select
    placeholder={null}
    bind:value={parameters.type}
    options={typeOptions}
  />
  <Label small>Fields</Label>
  <Multiselect
    value={parameters.fields || []}
    on:change={handleFieldChange}
    options={fieldOptions}
    placeholder={parameters.type === "reset"
      ? "Select fields to reset"
      : "Select fields to set"}
  />
  {#if parameters.type === "set" && parameters.fields && parameters.fields.length > 0}
    <div class="field-values">
      {#each parameters.fields as fieldName}
        <div class="field-value-pair">
          <div class="label-col">{fieldName}</div>
          <div class="input-col">
            <DrawerBindableInput
              title="Value for {fieldName}"
              {bindings}
              value={parameters.fieldValues?.[fieldName]}
              on:change={e => handleFieldValueChange(fieldName, e.detail)}
            />
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .root {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 90px 1fr;
    align-items: center;
    max-width: 400px;
    margin: 0 auto;
  }

  .field-values {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    gap: 0;
    overflow: hidden;
    border-top: 1px solid var(--spectrum-global-color-gray-200);
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }

  .field-value-pair {
    display: grid;
    grid-template-columns: 130px 1fr;
    column-gap: var(--spacing-m);
    align-items: center;
    padding: var(--spacing-m) 0;
    border-bottom: 1px solid var(--spectrum-global-color-gray-200);
  }

  .field-value-pair:last-child {
    border-bottom: none;
  }

  .label-col {
    font-size: 13px;
    font-weight: 500;
    color: var(--spectrum-global-color-gray-700);
    padding: 0 var(--spacing-l);
  }

  .input-col {
    padding: 0 var(--spacing-l) 0 0;
  }
</style>

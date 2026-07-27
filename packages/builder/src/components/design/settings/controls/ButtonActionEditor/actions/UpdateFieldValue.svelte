<script lang="ts">
  import { Select, Label, Multiselect } from "@budibase/bbui"
  import { onMount } from "svelte"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"
  import { selectedScreen, componentStore } from "@/stores/builder"
  import { getActionProviders, buildFormSchema } from "@/dataBinding"
  import { findComponent } from "@/helpers/components"
  import type { Component } from "@budibase/types"

  type UpdateFieldValueType = "set" | "reset"

  interface Parameters {
    componentId?: string
    type?: UpdateFieldValueType
    fields?: string[]
    fieldValues?: Record<string, string>
  }

  interface Props {
    parameters?: Parameters
    bindings?: unknown[]
    nested?: boolean
  }

  let {
    parameters = $bindable<Parameters>({}),
    bindings = [],
    nested,
  }: Props = $props()

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

  const getFormComponent = (
    asset: Component | undefined,
    id: string | undefined
  ) => {
    if (!id) {
      return null
    }
    let component = findComponent(asset, id)
    if (component) {
      return component
    }
    // Action provider IDs can include a suffix, e.g. "<componentId>-form".
    const componentId = id?.replace(/-(form|provider)$/, "")
    if (componentId && componentId !== id) {
      return findComponent(asset, componentId)
    }
    return null
  }

  const formComponent = $derived(
    getFormComponent($selectedScreen?.props, parameters.componentId)
  )
  const formSchema = $derived(buildFormSchema(formComponent))
  const fieldOptions = $derived(Object.keys(formSchema || {}))
  const selectedFields = $derived(parameters.fields || [])
  const actionProviders = $derived(
    getActionProviders(
      $selectedScreen,
      $componentStore.selectedComponentId,
      "UpdateFieldValue",
      { includeSelf: nested || false }
    )
  )

  onMount(() => {
    if (!parameters.type) {
      parameters = {
        ...parameters,
        type: "set",
      }
    }
  })

  const handleFormChange = (e: CustomEvent<string | undefined>) => {
    if (!e.detail) {
      return
    }

    parameters = {
      ...parameters,
      componentId: e.detail,
      fields: [],
      fieldValues: {},
    }
  }

  const handleTypeChange = (
    e: CustomEvent<UpdateFieldValueType | undefined>
  ) => {
    if (!e.detail) {
      return
    }

    parameters = {
      ...parameters,
      type: e.detail,
    }
  }

  const handleFieldChange = (e: CustomEvent<string[]>) => {
    parameters = {
      ...parameters,
      fields: e.detail || [],
      fieldValues: parameters.fieldValues || {},
    }
  }

  const handleFieldValueChange = (fieldName: string, value: string) => {
    parameters = {
      ...parameters,
      fieldValues: {
        ...(parameters.fieldValues || {}),
        [fieldName]: value,
      },
    }
  }
</script>

<div class="root">
  <Label size="S">Form</Label>
  <Select
    value={parameters.componentId}
    on:change={handleFormChange}
    options={actionProviders}
    getOptionLabel={x => x.readableBinding}
    getOptionValue={x => x.runtimeBinding}
  />
  <Label size="S">Type</Label>
  <Select
    placeholder={false}
    value={parameters.type}
    on:change={handleTypeChange}
    options={typeOptions}
  />
  <Label size="S">Fields</Label>
  <Multiselect
    value={selectedFields}
    on:change={handleFieldChange}
    options={fieldOptions}
    placeholder={parameters.type === "reset"
      ? "Select fields to reset"
      : "Select fields to set"}
  />
  {#if parameters.type === "set" && selectedFields.length > 0}
    <div class="field-values">
      {#each selectedFields as fieldName}
        <div class="field-value-pair">
          <div class="label-col">{fieldName}</div>
          <div class="input-col">
            <DrawerBindableInput
              title={`Value for ${fieldName}`}
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

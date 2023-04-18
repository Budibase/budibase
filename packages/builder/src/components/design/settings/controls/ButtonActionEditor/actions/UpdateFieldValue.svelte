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

  import { _ } from "../../../../../../../lang/i18n"

  export let parameters
  export let bindings = []

  const typeOptions = [
    {
      label: $_(
        "components.design.settings.controls.ButtonActionEditor.actions.UpdateFieldValue.Set_value"
      ),
      value: "set",
    },
    {
      label: $_(
        "components.design.settings.controls.ButtonActionEditor.actions.UpdateFieldValue.Reset_value"
      ),
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
  <Label small
    >{$_(
      "components.design.settings.controls.ButtonActionEditor.actions.UpdateFieldValue.Form"
    )}</Label
  >
  <Select
    bind:value={parameters.componentId}
    options={actionProviders}
    getOptionLabel={x => x._instanceName}
    getOptionValue={x => x._id}
  />
  <Label small
    >{$_(
      "components.design.settings.controls.ButtonActionEditor.actions.UpdateFieldValue.Type"
    )}</Label
  >
  <Select
    placeholder={null}
    bind:value={parameters.type}
    options={typeOptions}
  />
  <Label small
    >{$_(
      "components.design.settings.controls.ButtonActionEditor.actions.UpdateFieldValue.Field"
    )}</Label
  >
  <Combobox bind:value={parameters.field} options={fieldOptions} />
  {#if parameters.type === "set"}
    <Label small
      >{$_(
        "components.design.settings.controls.ButtonActionEditor.actions.UpdateFieldValue.Value"
      )}</Label
    >
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

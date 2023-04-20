<script>
  import { Select, Body } from "@budibase/bbui"
  import { onMount } from "svelte"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import { _ } from "../../../../../../../lang/i18n"

  export let parameters
  export let bindings

  const typeOptions = [
    {
      label: $_(
        "components.design.settings.controls.ButtonActionEditor.actions.Continuelf.Continue_if"
      ),
      value: "continue",
    },
    {
      label: $_(
        "components.design.settings.controls.ButtonActionEditor.actions.Continuelf.Stop_if"
      ),
      value: "stop",
    },
  ]
  const operatorOptions = [
    {
      label: $_(
        "components.design.settings.controls.ButtonActionEditor.actions.Continuelf.Equals"
      ),
      value: "equal",
    },
    {
      label: $_(
        "components.design.settings.controls.ButtonActionEditor.actions.Continuelf.Not_equals"
      ),
      value: "notEqual",
    },
  ]

  onMount(() => {
    if (!parameters.type) {
      parameters.type = "continue"
    }
    if (!parameters.operator) {
      parameters.operator = "equal"
    }
  })
</script>

<div class="root">
  <Body size="S">
    {$_(
      "components.design.settings.controls.ButtonActionEditor.actions.Continuelf.Configure_condition"
    )}
  </Body>
  <Select
    bind:value={parameters.type}
    options={typeOptions}
    placeholder={null}
  />
  <DrawerBindableInput
    placeholder={$_(
      "components.design.settings.controls.ButtonActionEditor.actions.Continuelf.Value"
    )}
    value={parameters.value}
    on:change={e => (parameters.value = e.detail)}
    {bindings}
  />
  <Select
    bind:value={parameters.operator}
    options={operatorOptions}
    placeholder={null}
  />
  <DrawerBindableInput
    placeholder={$_(
      "components.design.settings.controls.ButtonActionEditor.actions.Continuelf.Reference_value"
    )}
    bind:value={parameters.referenceValue}
    on:change={e => (parameters.referenceValue = e.detail)}
    {bindings}
  />
</div>

<style>
  .root {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
    justify-content: flex-start;
    align-items: stretch;
    max-width: 400px;
    margin: 0 auto;
  }
</style>

<script>
  import { Select, Label, Combobox, Checkbox, Body } from "@budibase/bbui"
  import { onMount } from "svelte"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import { getAllStateVariables } from "builderStore/dataBinding"

  import { _ } from "../../../../../../../lang/i18n"

  export let parameters
  export let bindings = []

  const keyOptions = getAllStateVariables()
  const typeOptions = [
    {
      label: $_(
        "components.design.settings.controls.ButtonActionEditor.actions.UpdateState.Set_value"
      ),
      value: "set",
    },
    {
      label: $_(
        "components.design.settings.controls.ButtonActionEditor.actions.UpdateState.Delete_value"
      ),
      value: "delete",
    },
  ]

  onMount(() => {
    if (!parameters.type) {
      parameters.type = "set"
    }
  })
</script>

<div class="root">
  <Label small
    >{$_(
      "components.design.settings.controls.ButtonActionEditor.actions.UpdateState.Type"
    )}</Label
  >
  <Select
    placeholder={null}
    bind:value={parameters.type}
    options={typeOptions}
  />
  <Label small
    >{$_(
      "components.design.settings.controls.ButtonActionEditor.actions.UpdateState.Key"
    )}</Label
  >
  <Combobox bind:value={parameters.key} options={keyOptions} />
  {#if parameters.type === "set"}
    <Label small
      >{$_(
        "components.design.settings.controls.ButtonActionEditor.actions.UpdateState.Value"
      )}</Label
    >
    <DrawerBindableInput
      {bindings}
      value={parameters.value}
      on:change={e => (parameters.value = e.detail)}
    />
    <div />
    <Checkbox
      bind:value={parameters.persist}
      text={$_(
        "components.design.settings.controls.ButtonActionEditor.actions.UpdateState.Persist_value"
      )}
    />
    <div />
    <Body size="XS">
      {$_(
        "components.design.settings.controls.ButtonActionEditor.actions.UpdateState.Persisted_values"
      )}
    </Body>
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

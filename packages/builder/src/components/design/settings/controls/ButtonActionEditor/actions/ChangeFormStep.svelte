<script>
  import { Select, Label, Stepper } from "@budibase/bbui"
  import { currentAsset, store } from "builderStore"
  import { getActionProviderComponents } from "builderStore/dataBinding"
  import { onMount } from "svelte"
  import { _ } from "../../../../../../../lang/i18n"

  export let parameters

  $: actionProviders = getActionProviderComponents(
    $currentAsset,
    $store.selectedComponentId,
    "ChangeFormStep"
  )

  const typeOptions = [
    {
      label: $_(
        "components.design.settings.controls.ButtonActionEditor.actions.ChangeFromStep.Next_step"
      ),
      value: "next",
    },
    {
      label: $_(
        "components.design.settings.controls.ButtonActionEditor.actions.ChangeFromStep.Previous_step"
      ),
      value: "prev",
    },
    {
      label: $_(
        "components.design.settings.controls.ButtonActionEditor.actions.ChangeFromStep.First_step"
      ),
      value: "first",
    },
    {
      label: $_(
        "components.design.settings.controls.ButtonActionEditor.actions.ChangeFromStep.Specific_step"
      ),
      value: "specific",
    },
  ]

  onMount(() => {
    if (!parameters.type) {
      parameters.type = "next"
    }
  })
</script>

<div class="root">
  <Label small
    >{$_(
      "components.design.settings.controls.ButtonActionEditor.actions.ChangeFromStep.Form"
    )}</Label
  >
  <Select
    placeholder={null}
    bind:value={parameters.componentId}
    options={actionProviders}
    getOptionLabel={x => x._instanceName}
    getOptionValue={x => x._id}
  />
  <Label small
    >{$_(
      "components.design.settings.controls.ButtonActionEditor.actions.ChangeFromStep.Step"
    )}</Label
  >
  <Select bind:value={parameters.type} options={typeOptions} />
  {#if parameters.type === "specific"}
    <Label small
      >{$_(
        "components.design.settings.controls.ButtonActionEditor.actions.ChangeFromStep.Number"
      )}</Label
    >
    <Stepper bind:value={parameters.number} />
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

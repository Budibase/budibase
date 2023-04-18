<script>
  import { Select, Label, Input, Checkbox } from "@budibase/bbui"
  import { automationStore } from "builderStore"
  import SaveFields from "./SaveFields.svelte"
  import { TriggerStepID } from "constants/backend/automations"

  import { _ } from "../../../../../../../lang/i18n"

  export let parameters = {}
  export let bindings = []

  const AUTOMATION_STATUS = {
    NEW: "new",
    EXISTING: "existing",
  }

  let automationStatus = parameters.automationId
    ? AUTOMATION_STATUS.EXISTING
    : AUTOMATION_STATUS.NEW

  $: automations = $automationStore.automations
    .filter(a => a.definition.trigger?.stepId === TriggerStepID.APP)
    .map(automation => {
      const schema = Object.entries(
        automation.definition.trigger.inputs.fields || {}
      ).map(([name, type]) => ({ name, type }))

      return {
        name: automation.name,
        _id: automation._id,
        schema,
      }
    })
  $: hasAutomations = automations && automations.length > 0
  $: selectedAutomation = automations?.find(
    a => a._id === parameters?.automationId
  )
  $: selectedSchema = selectedAutomation?.schema

  const onFieldsChanged = e => {
    parameters.fields = Object.entries(e.detail || {}).reduce(
      (acc, [key, value]) => {
        acc[key.trim()] = value
        return acc
      },
      {}
    )
  }

  const setNew = () => {
    automationStatus = AUTOMATION_STATUS.NEW
    parameters.automationId = undefined
    parameters.fields = {}
  }

  const setExisting = () => {
    automationStatus = AUTOMATION_STATUS.EXISTING
    parameters.newAutomationName = ""
    parameters.fields = {}
    parameters.automationId = automations[0]?._id
  }
</script>

<div class="root">
  <div class="radios">
    <div class="radio-container" on:click={setNew}>
      <input
        type="radio"
        value={AUTOMATION_STATUS.NEW}
        bind:group={automationStatus}
      />
      <Label small
        >{$_(
          "components.design.settings.controls.ButtonActionEditor.actions.TriggerAutomation.Create_automation"
        )}</Label
      >
    </div>
    <div class="radio-container" on:click={hasAutomations ? setExisting : null}>
      <input
        type="radio"
        value={AUTOMATION_STATUS.EXISTING}
        bind:group={automationStatus}
        disabled={!hasAutomations}
      />
      <Label small grey={!hasAutomations}
        >{$_(
          "components.design.settings.controls.ButtonActionEditor.actions.TriggerAutomation.Use_automation"
        )}</Label
      >
    </div>
  </div>

  <div class="params">
    <Label small
      >{$_(
        "components.design.settings.controls.ButtonActionEditor.actions.TriggerAutomation.Automation"
      )}</Label
    >

    {#if automationStatus === AUTOMATION_STATUS.EXISTING}
      <Select
        bind:value={parameters.automationId}
        placeholder={$_(
          "components.design.settings.controls.ButtonActionEditor.actions.TriggerAutomation.Choose_automation"
        )}
        options={automations}
        getOptionLabel={x => x.name}
        getOptionValue={x => x._id}
      />
    {:else}
      <Input
        bind:value={parameters.newAutomationName}
        placeholder={$_(
          "components.design.settings.controls.ButtonActionEditor.actions.TriggerAutomation.Enter_name"
        )}
      />
    {/if}

    <Label small />
    <Checkbox
      text={$_(
        "components.design.settings.controls.ButtonActionEditor.actions.TriggerAutomation.not_display"
      )}
      bind:value={parameters.notificationOverride}
    />
    <br />
    <Checkbox text="Require confirmation" bind:value={parameters.confirm} />

    {#if parameters.confirm}
      <Label small
        >{$_(
          "components.design.settings.controls.ButtonActionEditor.actions.TriggerAutomation.Confirm_text"
        )}</Label
      >
      <Input
        placeholder={$_(
          "components.design.settings.controls.ButtonActionEditor.actions.TriggerAutomation.want_trigger"
        )}
        bind:value={parameters.confirmText}
      />
    {/if}
  </div>

  <div class="fields">
    {#key parameters.automationId}
      <SaveFields
        schemaFields={selectedSchema}
        parameterFields={parameters.fields}
        fieldLabel={$_(
          "components.design.settings.controls.ButtonActionEditor.actions.TriggerAutomation.Field"
        )}
        on:change={onFieldsChanged}
        {bindings}
      />
    {/key}
  </div>
</div>

<style>
  .root {
    max-width: 800px;
    margin: 0 auto;
  }

  .params {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 60px 1fr;
    align-items: center;
  }

  .fields {
    margin-top: var(--spacing-l);
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: 60px 1fr auto 1fr auto;
    align-items: center;
  }

  .radios,
  .radio-container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .radios {
    gap: var(--spacing-m);
    margin-bottom: var(--spacing-l);
  }
  .radio-container {
    gap: var(--spacing-m);
  }
  .radio-container :global(label) {
    margin: 0;
  }

  input[type="radio"]:checked {
    background: var(--blue);
  }
</style>

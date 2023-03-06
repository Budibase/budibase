<script>
  import { Select, Label, Input, Checkbox } from "@budibase/bbui"
  import { automationStore } from "builderStore"
  import SaveFields from "./SaveFields.svelte"
  import { TriggerStepID } from "constants/backend/automations"

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
      <Label small>Create a new automation</Label>
    </div>
    <div class="radio-container" on:click={hasAutomations ? setExisting : null}>
      <input
        type="radio"
        value={AUTOMATION_STATUS.EXISTING}
        bind:group={automationStatus}
        disabled={!hasAutomations}
      />
      <Label small grey={!hasAutomations}>Use an existing automation</Label>
    </div>
  </div>

  <div class="params">
    <Label small>Automation</Label>

    {#if automationStatus === AUTOMATION_STATUS.EXISTING}
      <Select
        bind:value={parameters.automationId}
        placeholder="Choose automation"
        options={automations}
        getOptionLabel={x => x.name}
        getOptionValue={x => x._id}
      />
    {:else}
      <Input
        bind:value={parameters.newAutomationName}
        placeholder="Enter automation name"
      />
    {/if}

    <Label small />
    <Checkbox
      text="Do not display default notification"
      bind:value={parameters.notificationOverride}
    />
    <br />
    <Checkbox text="Require confirmation" bind:value={parameters.confirm} />

    {#if parameters.confirm}
      <Label small>Confirm text</Label>
      <Input
        placeholder="Are you sure you want to trigger this automation?"
        bind:value={parameters.confirmText}
      />
    {/if}
  </div>

  <div class="fields">
    {#key parameters.automationId}
      <SaveFields
        schemaFields={selectedSchema}
        parameterFields={parameters.fields}
        fieldLabel="Field"
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

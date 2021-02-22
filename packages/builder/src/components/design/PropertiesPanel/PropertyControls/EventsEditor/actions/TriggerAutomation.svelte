<script>
  import { Select, Label, Input } from "@budibase/bbui"
  import { automationStore } from "builderStore"
  import SaveFields from "./SaveFields.svelte"

  const AUTOMATION_STATUS = {
    NEW: "new",
    EXISTING: "existing",
  }

  export let parameters = {}

  let automationStatus = parameters.automationId
    ? AUTOMATION_STATUS.EXISTING
    : AUTOMATION_STATUS.NEW

  $: automations = $automationStore.automations
    .filter(a => a.definition.trigger?.stepId === "APP")
    .map(automation => {
      const schema = Object.entries(
        automation.definition.trigger.inputs.fields
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
    parameters.fields = e.detail
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
        bind:group={automationStatus} />
      <Label small>Create a new automation</Label>
    </div>
    <div class="radio-container" on:click={hasAutomations ? setExisting : null}>
      <input
        type="radio"
        value={AUTOMATION_STATUS.EXISTING}
        bind:group={automationStatus}
        disabled={!hasAutomations} />
      <Label small grey={!hasAutomations}>Use an existing automation</Label>
    </div>
  </div>

  <div class="fields">
    <Label small>Automation</Label>

    {#if automationStatus === AUTOMATION_STATUS.EXISTING}
      <Select
        thin
        secondary
        bind:value={parameters.automationId}
        placeholder="Choose automation">
        {#each automations as automation}
          <option value={automation._id}>{automation.name}</option>
        {/each}
      </Select>
    {:else}
      <Input
        thin
        bind:value={parameters.newAutomationName}
        placeholder="Enter automation name" />
    {/if}

    {#key parameters.automationId}
      <SaveFields
        schemaFields={selectedSchema}
        parameterFields={parameters.fields}
        fieldLabel="Field"
        on:change={onFieldsChanged} />
    {/key}
  </div>
</div>

<style>
  .fields {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    grid-template-columns: auto 1fr auto 1fr auto;
    align-items: baseline;
  }

  .fields :global(> div:nth-child(2)) {
    grid-column: 2 / span 4;
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

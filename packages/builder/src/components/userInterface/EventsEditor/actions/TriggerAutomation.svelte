<script>
  import { Select, Label } from "@budibase/bbui"
  import { automationStore } from "builderStore"
  import SaveFields from "./SaveFields.svelte"

  // parameters.contextPath used in the client handler to determine which row to save
  // this could be "data" or "data.parent", "data.parent.parent" etc
  export let parameters

  let idFields
  let schemaFields

  const automationSchema = automation => {
    const schema = Object.entries(
      automation.definition.trigger.inputs.fields
    ).map(([name, type]) => ({ name, type }))

    return {
      name: automation.name,
      _id: automation._id,
      schema,
    }
  }

  $: automations = $automationStore.automations
    .filter(a => a.definition.trigger && a.definition.trigger.stepId === "APP")
    .map(automationSchema)

  $: selectedAutomation =
    parameters &&
    parameters.automationId &&
    automations.find(a => a._id === parameters.automationId)

  const onFieldsChanged = e => {
    parameters.fields = e.detail
  }
</script>

<div class="root">

  {#if !automations || automations.length === 0}
    <div class="cannot-use">
      You must have an automation that has an "App Action" trigger.
    </div>
  {:else}
    <Label size="m" color="dark">Automation</Label>
    <Select secondary bind:value={parameters.automationId}>
      <option value="" />
      {#each automations as automation}
        <option value={automation._id}>{automation.name}</option>
      {/each}
    </Select>

    {#if selectedAutomation}
      <SaveFields
        parameterFields={parameters.fields}
        schemaFields={selectedAutomation.schema}
        on:fieldschanged={onFieldsChanged} />
    {/if}
  {/if}
</div>

<style>
  .root {
    display: grid;
    column-gap: var(--spacing-s);
    row-gap: var(--spacing-s);
    grid-template-columns: auto 1fr auto 1fr auto;
    align-items: baseline;
  }

  .root :global(> div:nth-child(2)) {
    grid-column-start: 2;
    grid-column-end: 6;
  }

  .cannot-use {
    color: var(--red);
    font-size: var(--font-size-s);
    text-align: center;
    width: 70%;
    margin: auto;
  }
</style>

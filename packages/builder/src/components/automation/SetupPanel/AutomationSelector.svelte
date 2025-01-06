<script>
  import { Select, Label } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { automationStore, selectedAutomation } from "@/stores/builder"
  import { TriggerStepID } from "@/constants/backend/automations"
  import DrawerBindableInput from "../../common/bindings/DrawerBindableInput.svelte"
  import AutomationBindingPanel from "../../common/bindings/ServerBindingPanel.svelte"

  const dispatch = createEventDispatcher()

  export let value
  export let bindings = []
  const onChangeAutomation = e => {
    value.automationId = e.detail
    dispatch("change", value)
  }

  const onChange = (e, field) => {
    value[field] = e.detail
    dispatch("change", value)
  }
  $: if (value?.automationId == null) value = { automationId: "" }

  $: automationFields =
    $automationStore.automations.find(
      automation => automation._id === value?.automationId
    )?.definition?.trigger?.inputs?.fields || []

  $: filteredAutomations = $automationStore.automations.filter(
    automation =>
      automation.definition.trigger.stepId === TriggerStepID.APP &&
      automation._id !== $selectedAutomation.data._id
  )
</script>

<div class="schema-field">
  <Label>Automation</Label>
  <div class="field-width">
    <Select
      on:change={onChangeAutomation}
      value={value.automationId}
      options={filteredAutomations}
      getOptionValue={automation => automation._id}
      getOptionLabel={automation => automation.name}
    />
  </div>
</div>
{#if Object.keys(automationFields)}
  {#each Object.keys(automationFields) as field}
    <div class="schema-field">
      <Label>{field}</Label>
      <div class="field-width">
        <DrawerBindableInput
          panel={AutomationBindingPanel}
          extraThin
          value={value[field]}
          on:change={e => onChange(e, field)}
          type="string"
          {bindings}
          updateOnChange={false}
        />
      </div>
    </div>
  {/each}
{/if}

<style>
  .field-width {
    width: 320px;
  }

  .schema-field {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    flex: 1;
    margin-bottom: 10px;
  }

  .schema-field :global(label) {
    text-transform: capitalize;
  }
</style>

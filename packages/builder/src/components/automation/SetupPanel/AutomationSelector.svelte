<script>
  import { Select } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { automationStore, selectedAutomation } from "@/stores/builder"
  import { TriggerStepID } from "@/constants/backend/automations"
  import DrawerBindableInput from "../../common/bindings/DrawerBindableInput.svelte"
  import AutomationBindingPanel from "../../common/bindings/ServerBindingPanel.svelte"
  import PropField from "./PropField.svelte"

  const dispatch = createEventDispatcher()

  export let value
  export let bindings = []
  export let title

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

<div class="selector">
  <PropField label={title} fullWidth>
    <Select
      on:change={onChangeAutomation}
      value={value.automationId}
      options={filteredAutomations}
      getOptionValue={automation => automation._id}
      getOptionLabel={automation => automation.name}
    />
  </PropField>
</div>
{#if Object.keys(automationFields)}
  {#each Object.keys(automationFields) as field}
    <div class="schema-field">
      <PropField label={field} fullWidth>
        <DrawerBindableInput
          panel={AutomationBindingPanel}
          extraThin
          value={value[field]}
          on:change={e => onChange(e, field)}
          type="string"
          {bindings}
          updateOnChange={false}
        />
      </PropField>
    </div>
  {/each}
{/if}

<style>
  .schema-field :global(label) {
    text-transform: capitalize;
  }
</style>

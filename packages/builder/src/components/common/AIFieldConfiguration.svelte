<script>
  import { Helpers, Multiselect, Select } from "@budibase/bbui"
  import ServerBindingPanel from "@/components/common/bindings/ServerBindingPanel.svelte"
  import ModalBindableInput from "@/components/common/bindings/ModalBindableInput.svelte"
  import {
    AIOperations,
    OperationFields,
    OperationFieldTypes,
  } from "@budibase/shared-core"

  const AIFieldConfigOptions = Object.keys(AIOperations).map(key => ({
    label: AIOperations[key].label,
    value: AIOperations[key].value,
  }))

  export let bindings
  export let context
  export let schema
  export let aiField = {}

  $: OperationField = OperationFields[aiField.operation]
  $: schemaWithoutRelations = Object.keys(schema).filter(
    key => schema[key].type !== "link"
  )
</script>

<Select
  label={"Operation"}
  options={AIFieldConfigOptions}
  bind:value={aiField.operation}
/>
{#if aiField.operation}
  {#each Object.keys(OperationField) as key}
    {#if OperationField[key] === OperationFieldTypes.BINDABLE_TEXT}
      <ModalBindableInput
        label={Helpers.capitalise(key)}
        panel={ServerBindingPanel}
        title="Prompt"
        on:change={e => (aiField[key] = e.detail)}
        value={aiField[key]}
        {bindings}
        allowJS
        {context}
      />
    {:else if OperationField[key] === OperationFieldTypes.MULTI_COLUMN}
      <Multiselect
        bind:value={aiField[key]}
        label={Helpers.capitalise(key)}
        options={schemaWithoutRelations}
      />
    {:else if OperationField[key] === OperationFieldTypes.COLUMN}
      <Select
        bind:value={aiField[key]}
        label={Helpers.capitalise(key)}
        options={schemaWithoutRelations}
      />
    {/if}
  {/each}
{/if}

<script>
  import { Input, Helpers, Multiselect, Select, TextArea } from "@budibase/bbui"
  import ServerBindingPanel from "components/common/bindings/ServerBindingPanel.svelte"
  import ModalBindableInput from "components/common/bindings/ModalBindableInput.svelte"

  const AIOperations = {
    SUMMARISE_TEXT: {
      label: "Summarise Text",
      value: "SUMMARISE_TEXT"
    },
    CLEAN_DATA: {
      label: "Clean Data",
      value: "CLEAN_DATA"
    },
    TRANSLATE: {
      label: "Translate",
      value: "TRANSLATE"
    },
    CATEGORISE_TEXT: {
      label: "Categorise Text",
      value: "CATEGORISE_TEXT"
    },
    SENTIMENT_ANALYSIS: {
      label: "Sentiment Analysis",
      value: "SENTIMENT_ANALYSIS"
    },
    PROMPT: {
      label: "Prompt",
      value: "PROMPT"
    },
    SEARCH_WEB: {
      label: "Search Web",
      value: "SEARCH_WEB"
    }
  }

  const OperationFieldTypes = {
    MULTI_COLUMN: "columns",
    COLUMN: "column",
    BINDABLE_TEXT: "prompt",
    // LANGUAGE: "language",
  }

  const OperationFields = {
    SUMMARISE_TEXT: {
      columns: OperationFieldTypes.MULTI_COLUMN,
    },
    CLEAN_DATA: {
      column: OperationFieldTypes.COLUMN,
    },
    TRANSLATE: {
      column: OperationFieldTypes.COLUMN,
      language: OperationFieldTypes.BINDABLE_TEXT,
    },
    CATEGORISE_TEXT: {
      columns: OperationFieldTypes.MULTI_COLUMN,
      categories: OperationFieldTypes.BINDABLE_TEXT,
    },
    SENTIMENT_ANALYSIS: {
      column: OperationFieldTypes.COLUMN,
    },
    PROMPT: {
      prompt: OperationFieldTypes.BINDABLE_TEXT,
    },
    SEARCH_WEB: {
      columns: OperationFieldTypes.MULTI_COLUMN,
    }
  }

  const AIFieldConfigOptions = Object.keys(AIOperations).map(key => ({
    label: AIOperations[key].label,
    value: AIOperations[key].value
  }))

  export let bindings
  export let context
  export let schema
  export let aiField = {}

  $: OperationField = OperationFields[aiField.operation] || null
  $: console.log(aiField)
  $: console.log(schema)
  $: schemaWithoutRelations = Object.keys(schema).filter(key => schema[key].type !== "link")
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
        on:change={e => aiField[key] = e.detail}
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
<script>
  import { backendUiStore } from "builderStore"
  import { Input, Select, Label } from "@budibase/bbui"
  import BindableInput from "../../../userInterface/BindableInput.svelte"

  export let value
  export let bindings

  $: model = $backendUiStore.models.find(model => model._id === value?.modelId)
  $: schemaFields = Object.entries(model?.schema ?? {})

  // Ensure any nullish modelId values get set to empty string so
  // that the select works
  $: if (value?.modelId == null) value = { modelId: "" }

  function schemaHasOptions(schema) {
    return !!schema.constraints?.inclusion?.length
  }
</script>

<div class="block-field">
  <Select bind:value={value.modelId} thin secondary>
    <option value="">Choose an option</option>
    {#each $backendUiStore.models as model}
      <option value={model._id}>{model.name}</option>
    {/each}
  </Select>
</div>

{#if schemaFields.length}
  <div class="schema-fields">
    {#each schemaFields as [field, schema]}
      <div class="capitalise">
        {#if schemaHasOptions(schema)}
          <div class="field-label">{field}</div>
          <Select thin secondary bind:value={value[field]}>
            <option value="">Choose an option</option>
            {#each schema.constraints.inclusion as option}
              <option value={option}>{option}</option>
            {/each}
          </Select>
        {:else if schema.type === 'string' || schema.type === 'number'}
          <BindableInput
            thin
            bind:value={value[field]}
            label={field}
            type="string"
            {bindings} />
        {/if}
      </div>
    {/each}
  </div>
{/if}

<style>
  .field-label {
    color: var(--ink);
    margin-bottom: 12px;
    display: flex;
    font-size: 14px;
    font-weight: 500;
    font-family: sans-serif;
  }

  .capitalise :global(label),
  .field-label {
    text-transform: capitalize;
  }

  .schema-fields {
    display: grid;
    grid-gap: var(--spacing-xl);
    margin-top: var(--spacing-xl);
  }
</style>

<script>
  import { backendUiStore } from "builderStore"
  import { Select } from "@budibase/bbui"
  import BindableInput from "../../common/BindableInput.svelte"

  export let value
  export let bindings

  $: table = $backendUiStore.tables.find(table => table._id === value?.tableId)
  $: schemaFields = Object.entries(table?.schema ?? {})

  // Ensure any nullish tableId values get set to empty string so
  // that the select works
  $: if (value?.tableId == null) value = { tableId: "" }

  function schemaHasOptions(schema) {
    return !!schema.constraints?.inclusion?.length
  }
</script>

<div class="block-field">
  <Select bind:value={value.tableId} extraThin secondary>
    <option value="">Choose an option</option>
    {#each $backendUiStore.tables as table}
      <option value={table._id}>{table.name}</option>
    {/each}
  </Select>
</div>

{#if schemaFields.length}
  <div class="schema-fields">
    {#each schemaFields as [field, schema]}
      {#if schemaHasOptions(schema)}
        <Select label={field} extraThin secondary bind:value={value[field]}>
          <option value="">Choose an option</option>
          {#each schema.constraints.inclusion as option}
            <option value={option}>{option}</option>
          {/each}
        </Select>
      {:else if schema.type === 'string' || schema.type === 'number'}
        <BindableInput
          extraThin
          bind:value={value[field]}
          label={field}
          type="string"
          {bindings} />
      {/if}
    {/each}
  </div>
{/if}

<style>
  .schema-fields {
    display: grid;
    grid-gap: var(--spacing-xl);
    margin-top: var(--spacing-xl);
  }
  .schema-fields :global(label) {
    text-transform: capitalize;
  }
</style>

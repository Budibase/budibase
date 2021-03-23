<script>
  import { tables } from 'builderStore/store/backend/'
  import { Select } from "@budibase/bbui"
  import DrawerBindableInput from "../../common/DrawerBindableInput.svelte"
  import AutomationBindingPanel from "./AutomationBindingPanel.svelte"

  export let value
  export let bindings

  $: table = $tables.list.find(table => table._id === value?.tableId)
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
    {#each $tables.list as table}
      <option value={table._id}>{table.name}</option>
    {/each}
  </Select>
</div>

{#if schemaFields.length}
  <div class="schema-fields">
    {#each schemaFields as [field, schema]}
      {#if !schema.autocolumn}
        {#if schemaHasOptions(schema)}
          <Select label={field} extraThin secondary bind:value={value[field]}>
            <option value="">Choose an option</option>
            {#each schema.constraints.inclusion as option}
              <option value={option}>{option}</option>
            {/each}
          </Select>
        {:else if schema.type === 'string' || schema.type === 'number'}
          <DrawerBindableInput
            panel={AutomationBindingPanel}
            extraThin
            value={value[field]}
            on:change={e => (value[field] = e.detail)}
            label={field}
            type="string"
            {bindings} />
        {/if}
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

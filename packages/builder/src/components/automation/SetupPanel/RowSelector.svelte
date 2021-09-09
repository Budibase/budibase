<script>
  import { tables } from "stores/backend"
  import { Select } from "@budibase/bbui"
  import DrawerBindableInput from "../../common/bindings/DrawerBindableInput.svelte"
  import AutomationBindingPanel from "../../common/bindings/ServerBindingPanel.svelte"
  import { createEventDispatcher } from "svelte"

  const dispatch = createEventDispatcher()

  const onChange = e => {
    value = e.detail
    dispatch("change", e.detail)
  }

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

<Select
  on:change={onChange}
  value={value.tableId}
  options={$tables.list}
  getOptionLabel={table => table.name}
  getOptionValue={table => table._id}
/>

{#if schemaFields.length}
  <div class="schema-fields">
    {#each schemaFields as [field, schema]}
      {#if !schema.autocolumn}
        {#if schemaHasOptions(schema)}
          <Select
            on:change={onChange}
            label={field}
            value={value[field]}
            options={schema.constraints.inclusion}
          />
        {:else if schema.type === "string" || schema.type === "number"}
          <DrawerBindableInput
            panel={AutomationBindingPanel}
            value={value[field]}
            on:change={e => {
              value[field] = e.detail
              dispatch("change", e.detail)
            }}
            label={field}
            type="string"
            {bindings}
          />
        {/if}
      {/if}
    {/each}
  </div>
{/if}

<style>
  .schema-fields {
    display: grid;
    grid-gap: var(--spacing-s);
    margin-top: var(--spacing-s);
  }
  .schema-fields :global(label) {
    text-transform: capitalize;
  }
</style>

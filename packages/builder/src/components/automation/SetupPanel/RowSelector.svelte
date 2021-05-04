<script>
  import { tables } from "stores/backend"
  import { Select } from "@budibase/bbui"
  import DrawerBindableInput from "../../common/DrawerBindableInput.svelte"
  import AutomationBindingPanel from "./AutomationBindingPanel.svelte"

  export let value
  export let bindings

  $: table = $tables.list.find((table) => table._id === value?.tableId)
  $: schemaFields = Object.entries(table?.schema ?? {})

  // Ensure any nullish tableId values get set to empty string so
  // that the select works
  $: if (value?.tableId == null) value = { tableId: "" }

  function schemaHasOptions(schema) {
    return !!schema.constraints?.inclusion?.length
  }
</script>

<Select
  bind:value={value.tableId}
  options={$tables.list}
<<<<<<< HEAD
  getOptionLabel={(table) => table.name}
  getOptionValue={(table) => table._id}
=======
  getOptionLabel={table => table.name}
  getOptionValue={table => table._id}
>>>>>>> 900637c221e4034babd21d69dcaa71b360a2adb2
/>

{#if schemaFields.length}
  <div class="schema-fields">
    {#each schemaFields as [field, schema]}
      {#if !schema.autocolumn}
        {#if schemaHasOptions(schema)}
          <Select
            label={field}
            bind:value={value[field]}
            options={schema.constraints.inclusion}
          />
        {:else if schema.type === "string" || schema.type === "number"}
          <DrawerBindableInput
            panel={AutomationBindingPanel}
            value={value[field]}
            on:change={(e) => (value[field] = e.detail)}
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

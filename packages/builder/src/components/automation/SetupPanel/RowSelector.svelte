<script>
  import { tables } from "stores/backend"
  import { Select, Toggle, DatePicker, Multiselect } from "@budibase/bbui"
  import DrawerBindableInput from "../../common/bindings/DrawerBindableInput.svelte"
  import AutomationBindingPanel from "../../common/bindings/ServerBindingPanel.svelte"
  import { createEventDispatcher } from "svelte"
  import ModalBindableInput from "components/common/bindings/ModalBindableInput.svelte"
  import { automationStore } from "builderStore"

  const dispatch = createEventDispatcher()

  export let value
  export let bindings
  $: table = $tables.list.find(table => table._id === value?.tableId)
  $: schemaFields = Object.entries(table?.schema ?? {})
  const onChangeTable = e => {
    value = { tableId: e.detail }
    dispatch("change", value)
  }

  const onChange = (e, field) => {
    value[field] = e.detail
    dispatch("change", value)
  }

  // Ensure any nullish tableId values get set to empty string so
  // that the select works
  $: if (value?.tableId == null) value = { tableId: "" }

  function schemaHasOptions(schema) {
    return !!schema.constraints?.inclusion?.length
  }
</script>

<Select
  on:change={onChangeTable}
  value={value.tableId}
  options={$tables.list}
  getOptionLabel={table => table.name}
  getOptionValue={table => table._id}
/>

{#if schemaFields.length}
  <div class="schema-fields">
    {#each schemaFields as [field, schema]}
      {#if !schema.autocolumn}
        {#if schemaHasOptions(schema) && schema.type !== "array"}
          <Select
            on:change={e => onChange(e, field)}
            label={field}
            value={value[field]}
            options={schema.constraints.inclusion}
          />
        {:else if schema.type === "datetime"}
          <DatePicker
            label={field}
            value={value[field]}
            on:change={e => onChange(e, field)}
          />
        {:else if schema.type === "boolean"}
          <Toggle
            text={field}
            value={value[field]}
            on:change={e => onChange(e, field)}
          />
        {:else if schema.type === "array"}
          <Multiselect
            bind:value={value[field]}
            label={field}
            options={schema.constraints.inclusion}
          />
        {:else if schema.type === "string" || schema.type === "number"}
          {#if $automationStore.selectedAutomation.automation.testData}
            <ModalBindableInput
              value={value[field]}
              panel={AutomationBindingPanel}
              label={field}
              type={value.customType}
              on:change={e => onChange(e, field)}
              {bindings}
            />
          {:else}
            <DrawerBindableInput
              panel={AutomationBindingPanel}
              value={value[field]}
              on:change={e => onChange(e, field)}
              label={field}
              type="string"
              {bindings}
              fillWidth={true}
              allowJS={false}
            />
          {/if}
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

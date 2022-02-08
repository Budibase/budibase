<script>
  import { tables } from "stores/backend"
  import { Select } from "@budibase/bbui"
  import DrawerBindableInput from "../../common/bindings/DrawerBindableInput.svelte"
  import AutomationBindingPanel from "../../common/bindings/ServerBindingPanel.svelte"
  import { createEventDispatcher } from "svelte"
  import ModalBindableInput from "components/common/bindings/ModalBindableInput.svelte"
  import { automationStore } from "builderStore"
  import RowSelectorTypes from "./RowSelectorTypes.svelte"

  const dispatch = createEventDispatcher()

  export let value
  export let bindings
  let table
  let schemaFields

  let placeholders = {
    number: 10,
    boolean: "true",
    datetime: "2022-02-16T12:00:00.000Z ",
    options: "1",
    array: "1,2,3,4",
    link: "ro_ta_123_456",
    longform: "long form text",
  }

  $: {
    table = $tables.list.find(table => table._id === value?.tableId)
    schemaFields = Object.entries(table?.schema ?? {})
    // surface the schema so the user can see it in the json
    schemaFields.map(([, schema]) => {
      if (!schema.autocolumn && !value[schema.name]) {
        value[schema.name] = ""
      }
    })
  }

  const onChangeTable = e => {
    value["tableId"] = e.detail
    dispatch("change", value)
  }

  const coerce = (value, type) => {
    if (type === "boolean") {
      return value === "true"
    }
    if (type === "number") {
      return Number(value)
    }
    if (type === "options") {
      return [value]
    }
    if (type === "array") {
      return value.split(",")
    }

    if (type === "link") {
      return [value]
    }

    return value
  }

  const onChange = (e, field, type) => {
    value[field] = coerce(e.detail, type)
    dispatch("change", value)
  }

  // Ensure any nullish tableId values get set to empty string so
  // that the select works
  $: if (value?.tableId == null) value = { tableId: "" }
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
        {#if schema.type !== "attachment"}
          {#if $automationStore.selectedAutomation.automation.testData}
            {#if $automationStore.selectedAutomation.automation.rowControl}
              <RowSelectorTypes
                {field}
                {schema}
                {bindings}
                {value}
                {onChange}
              />
            {:else}
              <ModalBindableInput
                placeholder={placeholders[schema.type]}
                value={value[field]}
                panel={AutomationBindingPanel}
                label={field}
                type={value.customType}
                on:change={e => onChange(e, field, schema.type)}
                {bindings}
              />
            {/if}
          {:else if $automationStore.selectedAutomation.automation.rowControl}
            <RowSelectorTypes {field} {schema} {bindings} {value} {onChange} />
          {:else}
            <DrawerBindableInput
              placeholder={placeholders[schema.type]}
              panel={AutomationBindingPanel}
              value={value[field]}
              on:change={e => onChange(e, field, schema.type)}
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

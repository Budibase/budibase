<script>
  import { tables } from "stores/builder"
  import { Select, Checkbox, Label } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import RowSelectorTypes from "./RowSelectorTypes.svelte"
  import DrawerBindableSlot from "../../common/bindings/DrawerBindableSlot.svelte"
  import AutomationBindingPanel from "../../common/bindings/ServerBindingPanel.svelte"
  import { TableNames } from "constants"

  const dispatch = createEventDispatcher()

  export let value
  export let meta
  export let bindings
  export let isTestModal
  export let isUpdateRow

  $: parsedBindings = bindings.map(binding => {
    let clone = Object.assign({}, binding)
    clone.icon = "ShareAndroid"
    return clone
  })

  let table
  let schemaFields

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
    const re = new RegExp(/{{([^{].*?)}}/g)
    if (re.test(value)) {
      return value
    }

    if (type === "number") {
      if (typeof value === "number") {
        return value
      }
      return Number(value)
    }
    if (type === "options" || type === "boolean") {
      return value
    }
    if (type === "array") {
      if (Array.isArray(value)) {
        return value
      }
      return value.split(",").map(x => x.trim())
    }

    if (type === "link") {
      if (Array.isArray(value)) {
        return value
      }
      return value.split(",").map(x => x.trim())
    }

    if (type === "json") {
      return value.value
    }

    return value
  }

  const onChange = (e, field, type) => {
    let newValue = {
      ...value,
      [field]: coerce(e.detail, type),
    }
    dispatch("change", newValue)
  }

  const onChangeSetting = (e, field) => {
    let fields = {}
    fields[field] = {
      clearRelationships: e.detail,
    }
    dispatch("change", {
      key: "meta",
      fields,
    })
  }

  // Ensure any nullish tableId values get set to empty string so
  // that the select works
  $: if (value?.tableId == null) value = { tableId: "" }
</script>

<div class="schema-fields">
  <Label>Table</Label>
  <div class="field-width">
    <Select
      on:change={onChangeTable}
      value={value.tableId}
      options={$tables.list.filter(table => table._id !== TableNames.USERS)}
      getOptionLabel={table => table.name}
      getOptionValue={table => table._id}
    />
  </div>
</div>
{#if schemaFields.length}
  {#each schemaFields as [field, schema]}
    {#if !schema.autocolumn && schema.type !== "attachment"}
      <div class="schema-fields">
        <Label>{field}</Label>
        <div class="field-width">
          {#if isTestModal}
            <RowSelectorTypes
              {isTestModal}
              {field}
              {schema}
              bindings={parsedBindings}
              {value}
              {onChange}
            />
          {:else}
            <DrawerBindableSlot
              fillWidth
              title={value.title || field}
              panel={AutomationBindingPanel}
              type={schema.type}
              {schema}
              value={value[field]}
              on:change={e => onChange(e, field)}
              {bindings}
              allowJS={true}
              updateOnChange={false}
              drawerLeft="260px"
            >
              <RowSelectorTypes
                {isTestModal}
                {field}
                {schema}
                bindings={parsedBindings}
                {value}
                {onChange}
              />
            </DrawerBindableSlot>
          {/if}

          {#if isUpdateRow && schema.type === "link"}
            <div class="checkbox-field">
              <Checkbox
                value={meta.fields?.[field]?.clearRelationships}
                text={"Clear relationships if empty?"}
                size={"S"}
                on:change={e => onChangeSetting(e, field)}
              />
            </div>
          {/if}
        </div>
      </div>
    {/if}
  {/each}
{/if}

<style>
  .field-width {
    width: 320px;
  }

  .schema-fields {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    flex: 1;
    margin-bottom: 10px;
  }
  .schema-fields :global(label) {
    text-transform: capitalize;
  }
  .checkbox-field {
    padding-bottom: var(--spacing-s);
    padding-left: 1px;
    padding-top: var(--spacing-s);
  }
  .checkbox-field :global(label) {
    text-transform: none;
  }
</style>

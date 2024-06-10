<script>
  import { tables } from "stores/builder"
  import { Select, Checkbox, Label } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { FieldType } from "@budibase/types"

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
  let attachmentTypes = [
    FieldType.ATTACHMENTS,
    FieldType.ATTACHMENT_SINGLE,
    FieldType.SIGNATURE_SINGLE,
  ]

  $: {
    table = $tables.list.find(table => table._id === value?.tableId)

    // Just sorting attachment types to the bottom here for a cleaner UX
    schemaFields = Object.entries(table?.schema ?? {}).sort(
      ([, schemaA], [, schemaB]) =>
        (schemaA.type === "attachment") - (schemaB.type === "attachment")
    )

    schemaFields.forEach(([, schema]) => {
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

  const onChangeSetting = (field, key, value) => {
    let newField = {}
    newField[field] = {
      [key]: value,
    }

    let updatedFields = {
      ...meta?.fields,
      ...newField,
    }

    dispatch("change", {
      key: "meta",
      fields: updatedFields,
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
    {#if !schema.autocolumn}
      <div class:schema-fields={!attachmentTypes.includes(schema.type)}>
        <Label>{field}</Label>
        <div class:field-width={!attachmentTypes.includes(schema.type)}>
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
                useAttachmentBinding={meta?.fields?.[field]
                  ?.useAttachmentBinding}
                {onChangeSetting}
              />
            </DrawerBindableSlot>
          {/if}

          {#if isUpdateRow && schema.type === "link"}
            <div class="checkbox-field">
              <Checkbox
                value={meta.fields?.[field]?.clearRelationships}
                text={"Clear relationships if empty?"}
                size={"S"}
                on:change={e =>
                  onChangeSetting(field, "clearRelationships", e.detail)}
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

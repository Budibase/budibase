<script>
  import { tables } from "stores/builder"
  import {
    Label,
    ActionButton,
    Popover,
    Icon,
    TooltipPosition,
    TooltipType,
  } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { FieldType } from "@budibase/types"

  import RowSelectorTypes from "./RowSelectorTypes.svelte"
  import DrawerBindableSlot from "../../common/bindings/DrawerBindableSlot.svelte"
  import AutomationBindingPanel from "../../common/bindings/ServerBindingPanel.svelte"
  import { FIELDS } from "constants/backend"
  import { capitalise } from "helpers"
  import { memo } from "@budibase/frontend-core"
  import PropField from "./PropField.svelte"
  import { cloneDeep, isPlainObject, mergeWith } from "lodash"

  const dispatch = createEventDispatcher()

  export let row
  export let meta
  export let bindings
  export let isTestModal

  const memoStore = memo({
    row,
    meta,
  })

  let table
  let schemaFields
  let attachmentTypes = [
    FieldType.ATTACHMENTS,
    FieldType.ATTACHMENT_SINGLE,
    FieldType.SIGNATURE_SINGLE,
  ]

  let customPopover
  let popoverAnchor
  let editableRow = {}
  let editableFields = {}

  // Avoid unnecessary updates
  $: memoStore.set({
    row,
    meta,
  })

  $: fields = $memoStore?.meta?.fields

  $: if ($memoStore?.meta?.fields) {
    editableFields = cloneDeep($memoStore?.meta?.fields)
  }

  $: parsedBindings = bindings.map(binding => {
    let clone = Object.assign({}, binding)
    clone.icon = "ShareAndroid"
    return clone
  })

  $: tableId = $memoStore?.row?.tableId
  $: if (tableId) {
    // Refresh all the row data
    editableRow = cloneDeep($memoStore?.row)

    table = $tables.list.find(table => table._id === tableId)

    if (table) {
      editableRow["tableId"] = tableId

      schemaFields = Object.entries(table?.schema ?? {})
        .filter(entry => {
          const [key, field] = entry
          return field.type !== "formula" && !field.autocolumn // DEAN - revise autocolumn exclusion for testmodal
        })
        .sort(
          ([, schemaA], [, schemaB]) =>
            (schemaA.type === "attachment") - (schemaB.type === "attachment")
        )

      // Parse out any data not in the schema.
      for (const column in editableFields) {
        if (!(column in table?.schema)) {
          delete editableFields[column]
        }
      }
      editableFields = editableFields
    }
    // Go through the table schema and build out the editable content
    for (const entry of schemaFields) {
      const [key, fieldSchema] = entry
      if ($memoStore?.row?.[key]) {
        // DEAN - review this
        editableRow = {
          ...editableRow,
          [key]: $memoStore?.row[key],
        }
      }

      // Legacy
      const emptyField =
        !$memoStore?.row[key] || $memoStore?.row[key]?.length === 0

      // Legacy
      // Put non-empty elements into the update and add their key to the fields list.
      if (!emptyField && !editableFields.hasOwnProperty(key)) {
        //DEAN - review this - IF THEY ADDED A NEW ONE IT WOULD BE MISSING FROM editableFields + editableFields
        console.log("EMPTY STATE DETECTED")
        editableFields = {
          ...editableFields,
          [key]: key,
        }
      }

      // Legacy - clearRelationships
      // Init the field and add it to the update.
      if (emptyField && editableFields[key]?.clearRelationships === true) {
        const emptyField = coerce(
          !$memoStore?.row.hasOwnProperty(key) ? "" : $memoStore?.row[key],
          fieldSchema.type
        )

        // remove this and place the field in the editable row.
        delete editableFields[key]?.clearRelationships

        // Default the field
        editableRow = {
          ...editableRow,
          [key]: emptyField,
        }
      }
    }

    // Possible to go through the automation fields schema?
    console.log("ACTUAL ROW", row)
    console.log("EDITABLE FIELDS", editableFields)
    console.log("EDITABLE ROW", editableRow)
  }

  // Legacy - add explicitly cleared relationships to the request.
  // DEAN - review this
  $: if (schemaFields?.length && fields && false) {
    // Meta fields processing.
    Object.keys(fields).forEach(key => {
      if (fields[key]?.clearRelationships) {
        columns.add(key)
      }
    })
    columns = new Set(columns)
  }

  $: typeToField = Object.values(FIELDS).reduce((acc, field) => {
    acc[field.type] = field
    return acc
  }, {})

  // Row coerce
  const coerce = (value, type) => {
    const re = new RegExp(/{{([^{].*?)}}/g)
    if (typeof value === "string" && re.test(value)) {
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
      if (!value) {
        return []
      }
      if (Array.isArray(value)) {
        return value
      }
      return value.split(",").map(x => x.trim())
    }

    if (type === "link") {
      if (!value) {
        return []
      } else if (Array.isArray(value)) {
        return value
      }
      return value.split(",").map(x => x.trim())
    }

    if (type === "json") {
      return value.value
    }

    return value
  }

  const isFullWidth = type => {
    return (
      attachmentTypes.includes(type) ||
      type === FieldType.JSON ||
      type === FieldType.LONGFORM
    )
  }

  const onChange = update => {
    const customizer = (objValue, srcValue, key) => {
      if (isPlainObject(objValue) && isPlainObject(srcValue)) {
        const result = mergeWith({}, objValue, srcValue, customizer)
        let outcome = Object.keys(result).reduce((acc, key) => {
          if (result[key] !== null) {
            acc[key] = result[key]
          } else {
          }
          return acc
        }, {})
        return outcome
      }
      return srcValue
    }

    const result = mergeWith(
      {},
      {
        row: editableRow,
        meta: {
          fields: editableFields,
        },
      },
      update,
      customizer
    )
    console.log("Row Selector - MERGED", result)
    dispatch("change", result)
  }
</script>

{#each schemaFields || [] as [field, schema]}
  {#if !schema.autocolumn && editableFields.hasOwnProperty(field)}
    <PropField label={field} fullWidth={isFullWidth(schema.type)}>
      <div class="prop-control-wrap">
        {#if isTestModal}
          <RowSelectorTypes
            {isTestModal}
            {field}
            {schema}
            bindings={parsedBindings}
            value={editableRow}
            meta={{
              fields: editableFields,
            }}
            {onChange}
          />
        {:else}
          <DrawerBindableSlot
            title={$memoStore?.row?.title || field}
            panel={AutomationBindingPanel}
            type={schema.type}
            {schema}
            value={editableRow[field]}
            on:change={e =>
              onChange({
                row: {
                  [field]: e.detail,
                },
              })}
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
              value={editableRow}
              meta={{
                fields: editableFields,
              }}
              onChange={change => {
                console.log("RowSelectorTypes > RowSelector > ", change)
                onChange(change)
              }}
            />
          </DrawerBindableSlot>
        {/if}
        <Icon
          hoverable
          name="Close"
          on:click={() =>
            onChange({
              row: { [field]: null },
              meta: { fields: { [field]: null } },
            })}
        />
      </div>
    </PropField>
  {/if}
{/each}

{#if table && schemaFields}
  <div
    class="add-fields-btn"
    class:empty={Object.is(editableFields, {})}
    bind:this={popoverAnchor}
  >
    <ActionButton
      icon="Add"
      fullWidth
      on:click={() => {
        customPopover.show()
      }}
      disabled={!schemaFields}
      >Add fields
    </ActionButton>
  </div>
{/if}

<Popover
  align="center"
  bind:this={customPopover}
  anchor={popoverAnchor}
  minWidth={popoverAnchor?.getBoundingClientRect()?.width}
  maxWidth={popoverAnchor?.getBoundingClientRect()?.width}
  maxHeight={300}
  resizable={false}
  offset={10}
>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <ul class="spectrum-Menu" role="listbox">
    {#each schemaFields || [] as [field, schema]}
      {#if !schema.autocolumn}
        <li
          class="table_field spectrum-Menu-item"
          class:is-selected={editableFields.hasOwnProperty(field)}
          on:click={e => {
            if (editableFields.hasOwnProperty(field)) {
              editableFields[field] = null
            } else {
              editableFields[field] = {}
            }
            onChange({ meta: { fields: editableFields } })
          }}
        >
          <Icon
            name={typeToField?.[schema.type]?.icon}
            color={"var(--spectrum-global-color-gray-600)"}
            tooltip={capitalise(schema.type)}
            tooltipType={TooltipType.Info}
            tooltipPosition={TooltipPosition.Left}
          />
          <div class="field_name spectrum-Menu-itemLabel">{field}</div>
          <svg
            class="spectrum-Icon spectrum-UIIcon-Checkmark100 spectrum-Menu-checkmark spectrum-Menu-itemIcon"
            focusable="false"
            aria-hidden="true"
          >
            <use xlink:href="#spectrum-css-icon-Checkmark100" />
          </svg>
        </li>
      {/if}
    {/each}
  </ul>
</Popover>

<style>
  .table_field {
    display: flex;
    padding: var(--spacing-s) var(--spacing-l);
    gap: var(--spacing-s);
  }

  li.is-selected .spectrum-Menu-itemLabel {
    color: var(--spectrum-global-color-gray-500);
  }

  .prop-control-wrap {
    display: grid;
    grid-template-columns: 1fr min-content;
    gap: var(--spacing-s);
  }

  /* Override for general json field override */
  .prop-control-wrap :global(.icon.json-slot-icon) {
    right: 1px !important;
  }
</style>

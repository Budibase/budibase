<script>
  import { tables } from "@/stores/builder"
  import {
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
  import { FIELDS } from "@/constants/backend"
  import { capitalise } from "@/helpers"
  import { memo } from "@budibase/frontend-core"
  import PropField from "./PropField.svelte"
  import { cloneDeep, isPlainObject, mergeWith } from "lodash"

  const dispatch = createEventDispatcher()

  export let row
  export let meta
  export let bindings
  export let isTestModal

  const typeToField = Object.values(FIELDS).reduce((acc, field) => {
    acc[field.type] = field
    return acc
  }, {})

  const memoStore = memo({
    row,
    meta,
  })

  let table
  // Row Schema Fields
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

  $: parsedBindings = bindings.map(binding => {
    let clone = Object.assign({}, binding)
    clone.icon = "ShareAndroid"
    return clone
  })

  $: tableId = $memoStore?.row?.tableId

  $: initData(tableId, $memoStore?.meta?.fields, $memoStore?.row)

  const initData = (tableId, metaFields, row) => {
    if (!tableId) {
      return
    }

    // Refesh the editable fields
    editableFields = cloneDeep(metaFields || {})

    // Refresh all the row data
    editableRow = cloneDeep(row || {})

    table = $tables.list.find(table => table._id === tableId)

    schemaFields = Object.entries(table?.schema ?? {})
      .filter(entry => {
        const [, field] = entry
        return field.type !== "formula" && !field.autocolumn
      })
      .sort(([nameA], [nameB]) => {
        return nameA < nameB ? -1 : 1
      })

    if (table) {
      editableRow["tableId"] = tableId

      // Parse out any data not in the schema.
      for (const column in editableFields) {
        if (!Object.hasOwn(table?.schema, column)) {
          delete editableFields[column]
        }
      }
    }

    // Go through the table schema and build out the editable content
    for (const entry of schemaFields) {
      const [key, fieldSchema] = entry

      const emptyField =
        editableRow[key] == null || editableRow[key]?.length === 0

      // Put non-empty elements into the update and add their key to the fields list.
      if (!emptyField && !Object.hasOwn(editableFields, key)) {
        editableFields = {
          ...editableFields,
          [key]: {},
        }
      }

      // Legacy - clearRelationships
      // Init the field and add it to the update.
      if (emptyField) {
        if (editableFields[key]?.clearRelationships === true) {
          const emptyField = coerce(
            !Object.hasOwn($memoStore?.row, key) ? "" : $memoStore?.row[key],
            fieldSchema.type
          )

          // remove this and place the field in the editable row.
          delete editableFields[key]?.clearRelationships

          // Default the field
          editableRow = {
            ...editableRow,
            [key]: emptyField,
          }
        } else {
          // Purge from the update as its presence is not necessary.
          delete editableRow[key]
        }
      }
    }

    // Parse all known row schema keys
    const schemaKeys = [
      "tableId",
      ...schemaFields.map(entry => {
        const [key] = entry
        return key
      }),
    ]

    // Purge any row keys that are not present in the schema.
    for (const rowKey of Object.keys(editableRow)) {
      if (!schemaKeys.includes(rowKey)) {
        delete editableRow[rowKey]
        delete editableFields[rowKey]
      }
    }
  }

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
    const customizer = (objValue, srcValue) => {
      if (isPlainObject(objValue) && isPlainObject(srcValue)) {
        const result = mergeWith({}, objValue, srcValue, customizer)
        let outcome = Object.keys(result).reduce((acc, key) => {
          if (result[key] !== null) {
            acc[key] = result[key]
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
    dispatch("change", result)
  }

  /**
   * Converts arrays into strings. The CodeEditor expects a string or encoded JS
   * @param{object} fieldValue
   */
  const drawerValue = fieldValue => {
    return Array.isArray(fieldValue) ? fieldValue.join(",") : fieldValue
  }
</script>

{#each schemaFields || [] as [field, schema]}
  {#if !schema.autocolumn && Object.hasOwn(editableFields, field)}
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
            value={drawerValue(editableRow[field])}
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
              onChange={change => onChange(change)}
            />
          </DrawerBindableSlot>
        {/if}
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
  anchor={editableFields ? popoverAnchor : null}
  useAnchorWidth
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
          class:is-selected={Object.hasOwn(editableFields, field)}
          on:click={() => {
            if (Object.hasOwn(editableFields, field)) {
              delete editableFields[field]
              onChange({
                meta: { fields: editableFields },
                row: { [field]: null },
              })
            } else {
              editableFields[field] = {}
              onChange({ meta: { fields: editableFields } })
            }
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

  /* Override for general json field override */
  .prop-control-wrap :global(.icon.json-slot-icon) {
    right: 1px !important;
  }
</style>

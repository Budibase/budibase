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
  let columns = new Set()

  // Avoid unnecessary updates
  $: memoStore.set({
    row,
    meta,
  })

  // Legacy support
  $: fields = $memoStore?.meta?.fields

  $: if ($memoStore?.meta?.columns) {
    columns = new Set(meta?.columns)
  }

  $: parsedBindings = bindings.map(binding => {
    let clone = Object.assign({}, binding)
    clone.icon = "ShareAndroid"
    return clone
  })

  $: tableId = $memoStore?.row?.tableId
  $: if (tableId) {
    table = $tables.list.find(table => table._id === tableId)

    if (table) {
      editableRow["tableId"] = tableId

      schemaFields = Object.entries(table?.schema ?? {})
        .filter(entry => {
          const [key, field] = entry
          return field.type !== "formula" && !field.autocolumn
        })
        .sort(
          ([, schemaA], [, schemaB]) =>
            (schemaA.type === "attachment") - (schemaB.type === "attachment")
        )

      // Parse out any unused data.
      if ($memoStore?.meta?.columns) {
        for (const column of meta?.columns) {
          if (!(column in table?.schema)) {
            columns.delete(column)
          }
        }
        columns = new Set(columns)
      }
    }

    if (columns.size) {
      for (const key of columns) {
        const entry = schemaFields.find(entry => {
          const [fieldKey] = entry
          return fieldKey == key
        })

        if (entry) {
          const [_, fieldSchema] = entry
          editableRow = {
            ...editableRow,
            [key]: coerce(
              !(key in $memoStore?.row) ? "" : $memoStore?.row[key],
              fieldSchema.type
            ),
          }
        }
      }
    } else {
      schemaFields.forEach(entry => {
        const [key] = entry
        if ($memoStore?.row?.[key] && !editableRow?.[key]) {
          editableRow = {
            ...editableRow,
            [key]: $memoStore?.row[key],
          }
          columns.add(key)
        }
      })
      columns = new Set(columns)
    }
  }

  // Legacy - add explicitly cleared relationships to the request.
  $: if (schemaFields?.length && fields) {
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

  const onChange = u => {
    const update = {
      _tableId: tableId,
      row: { ...$memoStore.row },
      meta: { ...$memoStore.meta },
      ...u,
    }
    dispatch("change", update)
  }

  const fieldUpdate = (e, field) => {
    const update = {
      row: {
        ...$memoStore?.row,
        [field]: e.detail,
      },
    }
    onChange(update)
  }
</script>

{#if columns.size}
  {#each schemaFields as [field, schema]}
    {#if !schema.autocolumn && columns.has(field)}
      <PropField
        label={field}
        fullWidth={attachmentTypes.includes(schema.type)}
      >
        <div class="prop-control-wrap">
          {#if isTestModal}
            <RowSelectorTypes
              {isTestModal}
              {field}
              {schema}
              bindings={parsedBindings}
              value={$memoStore?.row}
              onChange={fieldUpdate}
            />
          {:else}
            <DrawerBindableSlot
              title={$memoStore?.row?.title || field}
              panel={AutomationBindingPanel}
              type={schema.type}
              {schema}
              value={editableRow[field]}
              on:change={e => fieldUpdate(e, field)}
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
                onChange={fieldUpdate}
              />
            </DrawerBindableSlot>
          {/if}
          <Icon
            hoverable
            name="Close"
            on:click={() => {
              columns.delete(field)
              const update = { ...editableRow }
              delete update[field]
              onChange({ row: update, meta: { columns: Array.from(columns) } })
            }}
          />
        </div>
      </PropField>
    {/if}
  {/each}
{/if}

{#if table && schemaFields}
  <div
    class="add-fields-btn"
    class:empty={!columns?.size}
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
          class:is-selected={columns.has(field)}
          on:click={e => {
            if (columns.has(field)) {
              columns.delete(field)
            } else {
              columns.add(field)
            }
            onChange({ meta: { columns: Array.from(columns) } })
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
</style>

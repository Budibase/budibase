<script lang="ts">
  import { tables } from "@/stores/builder"
  import {
    ActionButton,
    Popover,
    Icon,
    TooltipPosition,
    TooltipType,
    ActionGroup,
    Modal,
    ModalContent,
  } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import {
    AutoReason,
    FieldType,
    type FieldSchema,
    type Table,
    type UIField,
  } from "@budibase/types"

  import RowSelectorTypes from "./RowSelectorTypes.svelte"
  import {
    DrawerBindableSlot,
    ServerBindingPanel as AutomationBindingPanel,
  } from "@/components/common/bindings"
  import { FIELDS } from "@/constants/backend"
  import { capitalise } from "@/helpers"
  import { memo } from "@budibase/frontend-core"
  import PropField from "./PropField.svelte"
  import { cloneDeep, isPlainObject, mergeWith } from "lodash"

  type EditableRow = Record<string, unknown> & {
    tableId?: string
    title?: string
  }
  type EditableField = Record<string, unknown> & {
    clearRelationships?: boolean
  }
  type EditableFields = Record<string, EditableField>
  type RowMeta = {
    fields?: EditableFields
  }
  type Binding = Record<string, unknown> & {
    icon?: string
  }
  type ChangeUpdate = {
    row?: EditableRow
    meta?: RowMeta
  }
  type SchemaEntry = [string, FieldSchema]
  type PopoverHandle = {
    show: () => void
  }

  const dispatch = createEventDispatcher<{
    change: ChangeUpdate
  }>()

  export let row: EditableRow
  export let meta: RowMeta
  export let bindings: Binding[] = []
  export let isTestModal: boolean
  export let context: Record<string, unknown> = {}
  export let componentWidth: number | undefined = undefined
  export let fullWidth = false

  const typeToField: Partial<Record<FieldType, UIField>> = {}
  for (const field of Object.values(FIELDS)) {
    typeToField[field.type] = field
  }

  const memoStore = memo({
    row,
    meta,
  })

  let table: Table | undefined
  // Row Schema Fields
  let schemaFields: SchemaEntry[] | undefined
  let attachmentTypes: FieldType[] = [
    FieldType.ATTACHMENTS,
    FieldType.ATTACHMENT_SINGLE,
    FieldType.SIGNATURE_SINGLE,
  ]

  let customPopover: PopoverHandle | undefined
  let modalPopover: PopoverHandle | undefined
  let fieldsModal: PopoverHandle | undefined
  let popoverAnchor: HTMLDivElement | null | undefined
  let modalPopoverAnchor: HTMLDivElement | null | undefined
  let editableRow: EditableRow = {}
  let editableFields: EditableFields = {}

  // Avoid unnecessary updates
  $: memoStore.set({
    row,
    meta,
  })

  $: parsedBindings = bindings.map((binding: Binding) => {
    let clone = Object.assign({}, binding)
    clone.icon = clone.icon ?? "ShareAndroid"
    return clone
  })

  $: tableId = $memoStore?.row?.tableId

  $: initData(tableId, $memoStore?.meta?.fields, $memoStore?.row)

  const isAutoincrement = (field: FieldSchema) => {
    return field.autocolumn && field.autoReason !== AutoReason.FOREIGN_KEY
  }

  const initData = (
    tableId: string | undefined,
    metaFields: EditableFields | undefined,
    row: EditableRow | undefined
  ) => {
    if (!tableId) {
      table = undefined
      schemaFields = undefined
      editableFields = {}
      editableRow = {}
      return
    }

    // Refesh the editable fields
    editableFields = cloneDeep(metaFields || {})

    // Refresh all the row data
    editableRow = cloneDeep(row || {})

    table = $tables.list.find((table: Table) => table._id === tableId)

    schemaFields = Object.entries(table?.schema ?? {})
      .filter(entry => {
        const [, field] = entry
        return field.type !== "formula" && !isAutoincrement(field)
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

      const emptyField = isEmptyFieldValue(editableRow[key])

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

  const isEmptyFieldValue = (value: unknown) => {
    if (value == null) {
      return true
    }
    if (typeof value === "string" || Array.isArray(value)) {
      return value.length === 0
    }
    return false
  }

  // Row coerce
  const coerce = (value: unknown, type: FieldType) => {
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
      return String(value)
        .split(",")
        .map((x: string) => x.trim())
    }

    if (type === "link") {
      if (!value) {
        return []
      } else if (Array.isArray(value)) {
        return value
      }
      return String(value)
        .split(",")
        .map((x: string) => x.trim())
    }

    if (
      type === "json" &&
      typeof value === "object" &&
      value != null &&
      "value" in value
    ) {
      return value.value
    }

    return value
  }

  const isFullWidth = (type: FieldType) => {
    return (
      attachmentTypes.includes(type) ||
      type === FieldType.JSON ||
      type === FieldType.LONGFORM
    )
  }

  const emitChange = (update: ChangeUpdate) => {
    dispatch("change", update)
  }

  const handleChange = (update: ChangeUpdate) => {
    const customizer = (objValue: unknown, srcValue: unknown) => {
      if (isPlainObject(objValue) && isPlainObject(srcValue)) {
        const result: Record<string, unknown> = mergeWith(
          {},
          objValue,
          srcValue,
          customizer
        )
        let outcome: Record<string, unknown> = Object.keys(result).reduce(
          (acc: Record<string, unknown>, key: string) => {
            if (result[key] !== null) {
              acc[key] = result[key]
            }
            return acc
          },
          {}
        )
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
    emitChange(result)
  }

  /**
   * Converts arrays into strings. The CodeEditor expects a string or encoded JS
   * @param{object} fieldValue
   */
  const drawerValue = (fieldValue: unknown) => {
    if (fieldValue == null) {
      return undefined
    }
    return Array.isArray(fieldValue) ? fieldValue.join(",") : String(fieldValue)
  }

  // The element controls their own binding drawer
  const customDrawer = ["string", "number", "barcodeqr", "bigint"]
</script>

{#if table && schemaFields}
  <div class="add-fields-btn" class:empty={Object.is(editableFields, {})}>
    <PropField {componentWidth} {fullWidth}>
      <div class="prop-control-wrap" bind:this={popoverAnchor}>
        <ActionGroup>
          <ActionButton
            on:click={() => {
              customPopover?.show()
            }}
            disabled={!schemaFields}
          >
            Edit fields
          </ActionButton>
          {#if schemaFields.length}
            <ActionButton
              on:click={() => {
                emitChange({
                  meta: { fields: {} },
                  row: {},
                })
              }}
            >
              Clear
            </ActionButton>
            <ActionButton
              on:click={() => {
                fieldsModal?.show()
              }}
            >
              <Icon name="arrows-out-simple" size="S" />
            </ActionButton>
          {/if}
        </ActionGroup>
      </div>
    </PropField>
  </div>
{/if}

{#each schemaFields || [] as [field, schema]}
  {#if !isAutoincrement(schema) && Object.hasOwn(editableFields, field)}
    <PropField
      label={field}
      fullWidth={fullWidth || isFullWidth(schema.type)}
      {componentWidth}
    >
      {#if customDrawer.includes(schema.type) || isTestModal}
        <div class="prop-control-wrap">
          <RowSelectorTypes
            {isTestModal}
            {field}
            {schema}
            bindings={parsedBindings}
            value={editableRow}
            meta={{
              fields: editableFields,
            }}
            onChange={handleChange}
            {context}
          />
        </div>
      {:else}
        <DrawerBindableSlot
          title={$memoStore?.row?.title || field}
          panel={AutomationBindingPanel}
          type={schema.type}
          {schema}
          value={drawerValue(editableRow[field])}
          on:change={e =>
            handleChange({
              row: {
                [field]: e.detail,
              },
            })}
          {bindings}
          allowJS={true}
          updateOnChange={false}
          {context}
        >
          <div class="prop-control-wrap">
            <RowSelectorTypes
              {isTestModal}
              {field}
              {schema}
              bindings={parsedBindings}
              value={editableRow}
              meta={{
                fields: editableFields,
              }}
              onChange={handleChange}
              {context}
            />
          </div>
        </DrawerBindableSlot>
      {/if}
    </PropField>
  {/if}
{/each}

<Popover
  align="left"
  bind:this={customPopover}
  anchor={editableFields ? popoverAnchor || undefined : undefined}
  widthMode="fixed-to-anchor"
  maxHeight={300}
  resizable={false}
>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
  <ul class="spectrum-Menu" role="listbox">
    {#each schemaFields || [] as [field, schema]}
      {#if !isAutoincrement(schema)}
        <li
          class="table_field spectrum-Menu-item"
          class:is-selected={Object.hasOwn(editableFields, field)}
          on:click={() => {
            if (Object.hasOwn(editableFields, field)) {
              delete editableFields[field]
              handleChange({
                meta: { fields: editableFields },
                row: { [field]: null },
              })
            } else {
              editableFields[field] = {}
              handleChange({ meta: { fields: editableFields } })
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
          <div class="check">
            <Icon name="check" />
          </div>
        </li>
      {/if}
    {/each}
  </ul>
</Popover>

<Modal bind:this={fieldsModal}>
  <ModalContent
    title="Edit fields"
    size="XL"
    showCancelButton={false}
    showConfirmButton={false}
  >
    <div class="modal-fields">
      <div class="modal-actions" bind:this={modalPopoverAnchor}>
        <ActionGroup>
          <ActionButton
            on:click={() => {
              modalPopover?.show()
            }}
            disabled={!schemaFields}
          >
            Edit fields
          </ActionButton>
          {#if schemaFields?.length}
            <ActionButton
              on:click={() => {
                emitChange({
                  meta: { fields: {} },
                  row: {},
                })
              }}
            >
              Clear
            </ActionButton>
          {/if}
        </ActionGroup>
      </div>

      {#each schemaFields || [] as [field, schema]}
        {#if !isAutoincrement(schema) && Object.hasOwn(editableFields, field)}
          <PropField label={field} fullWidth={true} {componentWidth}>
            <div class="prop-control-wrap">
              <RowSelectorTypes
                isTestModal={true}
                {field}
                {schema}
                bindings={parsedBindings}
                value={editableRow}
                meta={{
                  fields: editableFields,
                }}
                onChange={handleChange}
                {context}
              />
            </div>
          </PropField>
        {/if}
      {/each}
    </div>

    <Popover
      align="left"
      bind:this={modalPopover}
      anchor={editableFields ? modalPopoverAnchor || undefined : undefined}
      widthMode="fixed-to-anchor"
      maxHeight={500}
      resizable={false}
    >
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
      <ul class="spectrum-Menu" role="listbox">
        {#each schemaFields || [] as [field, schema]}
          {#if !isAutoincrement(schema)}
            <li
              class="table_field spectrum-Menu-item"
              class:is-selected={Object.hasOwn(editableFields, field)}
              on:click={() => {
                if (Object.hasOwn(editableFields, field)) {
                  delete editableFields[field]
                  handleChange({
                    meta: { fields: editableFields },
                    row: { [field]: null },
                  })
                } else {
                  editableFields[field] = {}
                  handleChange({ meta: { fields: editableFields } })
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
              <div class="check">
                <Icon name="check" />
              </div>
            </li>
          {/if}
        {/each}
      </ul>
    </Popover>
  </ModalContent>
</Modal>

<style>
  .modal-fields {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
    max-height: 70vh;
    overflow-y: auto;
    padding-right: var(--spacing-s);
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
  }

  .table_field {
    display: flex;
    padding: var(--spacing-s) var(--spacing-l);
    gap: var(--spacing-s);
  }

  /* Override for general json field override */
  .prop-control-wrap :global(.icon.json-slot-icon) {
    right: 1px !important;
  }

  .check {
    display: none;
  }
  li.is-selected .check {
    display: block;
  }
</style>

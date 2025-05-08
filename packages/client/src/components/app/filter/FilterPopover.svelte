<script lang="ts">
  import {
    type PopoverAPI,
    Popover,
    PopoverAlignment,
    Input,
    Button,
    Select,
    Helpers,
    CoreCheckboxGroup,
    CoreRadioGroup,
    DatePicker,
    DateRangePicker,
  } from "@budibase/bbui"
  import {
    FilterValueType,
    OperatorOptions,
  } from "@budibase/frontend-core/src/constants"
  import {
    type FieldSchema,
    type FilterConfig,
    type TableSchema,
    type SearchFilter,
    ArrayOperator,
    BasicOperator,
    FieldType,
  } from "@budibase/types"
  import { createEventDispatcher } from "svelte"
  import BbReferenceField from "../forms/BBReferenceField.svelte"
  import { type Writable } from "svelte/store"
  import { getContext } from "svelte"
  import { isArrayOperator } from "@/utils/filtering"
  import dayjs from "dayjs"
  import utc from "dayjs/plugin/utc"

  dayjs.extend(utc)

  export const show = () => popover?.show()
  export const hide = () => popover?.hide()

  export let align: PopoverAlignment = PopoverAlignment.Left
  export let showPopover: boolean = true
  export let filter: SearchFilter | undefined = undefined
  export let schema: TableSchema | null = null
  export let config: FilterConfig | undefined = undefined
  export let operators:
    | {
        value: string
        label: string
      }[]
    | undefined = undefined

  const dispatch = createEventDispatcher()
  const rowCache: Writable<Record<string, any>> = getContext("rows")

  let popover: PopoverAPI | undefined
  let anchor: HTMLElement | undefined
  let open: boolean = false

  // Date/time
  let enableTime: boolean
  let timeOnly: boolean
  let ignoreTimezones: boolean

  // Change on update
  $: editableFilter = getDefaultFilter(filter, schema, config)
  $: fieldSchema = config ? schema?.[config?.field] : undefined
  $: options = getOptions(fieldSchema)

  $: if (fieldSchema?.type === FieldType.DATETIME) {
    enableTime = !fieldSchema?.dateOnly
    timeOnly = !!fieldSchema?.timeOnly
    ignoreTimezones = !!fieldSchema?.ignoreTimezones
  }

  const parseDateRange = (
    range: { high: string; low: string } | undefined
  ): string[] | undefined => {
    if (!range) {
      return
    }
    const values = [range.low, range.high]
    if (values.filter(value => value).length === 2) {
      return values
    }
  }

  const sanitizeOperator = (
    filter: SearchFilter | undefined
  ): SearchFilter | undefined => {
    if (!filter) return
    const clone = Helpers.cloneDeep(filter)
    const isOperatorArray = isArrayOperator(filter.operator)

    // Ensure the correct filter value types when switching between operators.
    // Accommodates the user picker which always returns an array.
    // Also ensures that strings using 'oneOf' operator are left as strings
    if (
      isOperatorArray &&
      typeof filter.value === "string" &&
      ![FieldType.STRING, FieldType.NUMBER].includes(filter.type!)
    ) {
      clone.value = [filter.value]
    } else if (isOperatorArray && !filter?.value?.length) {
      delete clone.value
    } else if (!isOperatorArray && Array.isArray(filter.value)) {
      clone.value = filter.value[0]
    }

    // Update the noValue flag if the operator does not take a value
    const noValueOptions = [
      OperatorOptions.Empty.value,
      OperatorOptions.NotEmpty.value,
    ]
    clone.noValue = noValueOptions.includes(clone.operator)

    // Clear out the value when the operator is unset or the value
    if (!clone?.operator) {
      delete clone.value
    }

    return clone
  }

  const getOptions = (schema: FieldSchema | undefined) => {
    if (!schema) return []
    const constraints = fieldSchema?.constraints
    const opts = constraints?.inclusion ?? []
    return opts
  }

  const getDefaultFilter = (
    filter: SearchFilter | undefined,
    schema: TableSchema | null,
    config: FilterConfig | undefined
  ) => {
    if (filter) {
      return Helpers.cloneDeep(filter)
    } else if (!schema || !config) {
      return
    }
    const schemaField = schema[config.field]
    const defaultValue =
      schemaField?.type === FieldType.BOOLEAN ? "true" : undefined

    const defaultFilter: SearchFilter = {
      valueType: FilterValueType.VALUE,
      field: config.field,
      type: schemaField?.type,
      operator: BasicOperator.EMPTY,
      value: defaultValue,
    }
    return {
      ...defaultFilter,
      operator: operators?.[0]?.value,
    } as SearchFilter
  }

  const changeUser = (update: { value: string[] }) => {
    if (!update || !editableFilter) return

    editableFilter = sanitizeOperator({
      ...editableFilter,
      value: update.value,
    })
  }

  const cacheUserRows = (e: CustomEvent) => {
    const retrieved = e.detail.reduce((acc: any, ele: any) => {
      acc[ele._id] = ele
      return acc
    }, {})

    rowCache.update(state => ({
      ...state,
      ...retrieved,
    }))
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="anchor" bind:this={anchor} on:click={show}>
  <slot name="anchor" />
</div>

<Popover
  bind:this={popover}
  bind:open
  minWidth={300}
  maxWidth={300}
  {anchor}
  {align}
  {showPopover}
  on:open
  on:close
  customZIndex={5}
>
  <div class="filter-popover">
    <div class="filter-popover-body">
      {#if editableFilter && fieldSchema}
        <div class="operator">
          <Select
            quiet
            value={editableFilter.operator}
            disabled={!editableFilter.field}
            options={operators}
            autoWidth
            on:change={e => {
              if (!editableFilter) return

              const sanitized = sanitizeOperator({
                ...editableFilter,
                operator: e.detail,
              })

              editableFilter = { ...(sanitized || editableFilter) }
            }}
          />
        </div>

        {#if editableFilter?.type && [FieldType.STRING, FieldType.LONGFORM, FieldType.NUMBER, FieldType.BIGINT, FieldType.FORMULA, FieldType.AI].includes(editableFilter.type)}
          <Input
            disabled={editableFilter.noValue}
            value={editableFilter.value}
            on:change={e => {
              if (!editableFilter) return
              editableFilter = sanitizeOperator({
                ...editableFilter,
                value: e.detail,
              })
            }}
          />
        {:else if (editableFilter?.type && editableFilter?.type === FieldType.ARRAY) || (editableFilter.type === FieldType.OPTIONS && editableFilter.operator === ArrayOperator.ONE_OF)}
          {@const isMulti = isArrayOperator(editableFilter.operator)}
          {@const type = isMulti ? CoreCheckboxGroup : CoreRadioGroup}
          {#key type}
            <svelte:component
              this={type}
              value={editableFilter.value || []}
              disabled={editableFilter.noValue}
              {options}
              direction={"vertical"}
              on:change={e => {
                if (!editableFilter) return
                editableFilter = sanitizeOperator({
                  ...editableFilter,
                  value: e.detail,
                })
              }}
            />
          {/key}
        {:else if editableFilter.type === FieldType.OPTIONS}
          <CoreRadioGroup
            value={editableFilter.value}
            disabled={editableFilter.noValue}
            {options}
            direction={"vertical"}
            on:change={e => {
              if (!editableFilter) return
              editableFilter = sanitizeOperator({
                ...editableFilter,
                value: e.detail,
              })
            }}
          />
        {:else if editableFilter.type === FieldType.DATETIME && editableFilter.operator === "range"}
          <DateRangePicker
            {enableTime}
            {timeOnly}
            {ignoreTimezones}
            value={parseDateRange(editableFilter.value)}
            on:change={e => {
              const [from, to] = e.detail
              const parsedFrom = enableTime
                ? from.utc().format()
                : Helpers.stringifyDate(from, {
                    enableTime,
                    timeOnly,
                    ignoreTimezones,
                  })

              const parsedTo = enableTime
                ? to.utc().format()
                : Helpers.stringifyDate(to, {
                    enableTime,
                    timeOnly,
                    ignoreTimezones,
                  })

              if (!editableFilter) return
              editableFilter = sanitizeOperator({
                ...editableFilter,
                value: {
                  low: parsedFrom,
                  high: parsedTo,
                },
              })
            }}
          />
        {:else if editableFilter.type === FieldType.DATETIME}
          <DatePicker
            {enableTime}
            {timeOnly}
            {ignoreTimezones}
            disabled={editableFilter.noValue}
            value={editableFilter.value}
            on:change={e => {
              if (!editableFilter) return
              editableFilter = sanitizeOperator({
                ...editableFilter,
                value: e.detail,
              })
            }}
          />
        {:else if editableFilter.type === FieldType.BOOLEAN}
          <Select
            value={editableFilter.value}
            disabled={editableFilter.noValue}
            options={[
              { label: "True", value: "true" },
              { label: "False", value: "false" },
            ]}
            on:change={e => {
              if (!editableFilter) return
              editableFilter = sanitizeOperator({
                ...editableFilter,
                value: e.detail,
              })
            }}
          />
        {:else if editableFilter.type && [FieldType.BB_REFERENCE, FieldType.BB_REFERENCE_SINGLE].includes(editableFilter.type)}
          <!-- Multi relates to the operator, not the type -->
          {@const multi = isArrayOperator(editableFilter.operator)}
          {#key multi}
            <BbReferenceField
              disabled={editableFilter.noValue}
              defaultValue={editableFilter.value}
              {multi}
              onChange={changeUser}
              defaultRows={Object.values($rowCache)}
              on:rows={cacheUserRows}
            />
          {/key}
        {:else}
          <Input disabled />
        {/if}
        <!-- Needs to be disabled if there is nothing-->
        <Button
          cta
          on:click={() => {
            const sanitized = sanitizeOperator(editableFilter)
            const { noValue, value, operator } = sanitized || {}

            // Check for empty filter. if empty on invalid set it to undefined.
            const update =
              (!noValue && !value) || !operator ? undefined : sanitized

            dispatch("change", update)
            hide()
          }}
        >
          Apply
        </Button>
      {/if}
    </div>
  </div>
</Popover>

<style>
  .operator {
    display: flex;
  }
  .operator :global(.spectrum-Picker) {
    height: auto;
  }
  .filter-popover {
    background-color: var(--spectrum-alias-background-color-primary);
  }
  .filter-popover-body {
    padding: var(--spacing-m);
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-m);
  }
</style>

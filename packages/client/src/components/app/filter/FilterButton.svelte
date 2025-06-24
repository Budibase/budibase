<script lang="ts">
  import FilterPopover from "./FilterPopover.svelte"
  import {
    type FieldSchema,
    type FilterConfig,
    type TableSchema,
    type SearchFilter,
    FieldType,
    RangeOperator,
  } from "@budibase/types"
  import { type PopoverAPI, Helpers, Icon } from "@budibase/bbui"
  import { createEventDispatcher, getContext } from "svelte"
  import { type Writable } from "svelte/store"
  import { isArrayOperator } from "@/utils/filtering"

  export let disabled = false
  export let size: "S" | "M" | "L" = "S"
  export let buttonText = "Apply"

  export let filter: SearchFilter | undefined = undefined
  export let config: FilterConfig | undefined = undefined
  export let schema: TableSchema | null = null
  export let operators:
    | {
        value: string
        label: string
      }[]
    | undefined = undefined

  const dispatch = createEventDispatcher()
  const rowCache: Writable<Record<string, any>> = getContext("rows")

  let popover: PopoverAPI
  let button: HTMLDivElement

  let filterMeta: string | undefined
  let filterTitle: string | undefined

  $: iconName = !filter ? "plus-circle" : "x-circle"
  $: fieldSchema = config ? schema?.[config?.field] : undefined
  $: filterOp = filter
    ? operators?.find(op => op.value === filter.operator)
    : undefined

  $: truncate = filterOp?.value !== RangeOperator.RANGE
  $: filterDisplay = displayText(filter, fieldSchema)

  const parseDateDisplay = (
    filter: SearchFilter | undefined,
    fieldSchema: FieldSchema | undefined
  ) => {
    if (!filter || !fieldSchema || fieldSchema.type !== FieldType.DATETIME)
      return ""

    if (filter.operator === RangeOperator.RANGE) {
      const enableTime = !fieldSchema.dateOnly
      const { high, low } = filter.value
      return `${Helpers.getDateDisplayValue(low, { enableTime })} 
        - ${Helpers.getDateDisplayValue(high, { enableTime })}`
    }

    const parsed = Helpers.parseDate(filter.value, {
      enableTime: !fieldSchema.dateOnly,
    })

    const display = Helpers.getDateDisplayValue(parsed, {
      enableTime: !fieldSchema.dateOnly,
    })

    return `${display}`
  }

  const parseMultiDisplay = (value: string[] | undefined) => {
    const moreThanOne =
      Array.isArray(value) && value?.length > 1
        ? `+${value?.length - 1} more`
        : undefined
    filterMeta = moreThanOne
    filterTitle = `${value?.join(", ")}`

    return `${value?.[0]}`
  }

  /**
   * Determine appropriate display text for the filter button
   * @param filter
   * @param fieldSchema
   */
  const displayText = (
    filter: SearchFilter | undefined,
    fieldSchema: FieldSchema | undefined
  ) => {
    filterMeta = undefined
    filterTitle = undefined
    if (!filter || !fieldSchema) return

    // Default to the base value. This could be a string or an array
    // Some of the values could be refs for users.
    let display = filter.value

    if (fieldSchema.type === FieldType.BOOLEAN) {
      display = Helpers.capitalise(filter.value)
    } else if (fieldSchema.type === FieldType.DATETIME) {
      display = parseDateDisplay(filter, fieldSchema)
    } else if (fieldSchema.type === FieldType.ARRAY) {
      if (!isArrayOperator(filter.operator)) {
        display = filter.value
      } else {
        const filterVals = Array.isArray(filter.value)
          ? filter.value
          : [filter.value]
        display = parseMultiDisplay(filterVals)
      }
    } else if (
      fieldSchema.type === FieldType.BB_REFERENCE ||
      fieldSchema.type === FieldType.BB_REFERENCE_SINGLE
    ) {
      // The display text for the user refs is dependent on
      // a row cache.
      let userDisplay: string = ""

      // Process as single if the operator requires it
      if (!isArrayOperator(filter.operator)) {
        const userRow = $rowCache?.[filter.value]
        userDisplay = userRow?.email ?? filter.value
      } else {
        const filterVals = Array.isArray(filter.value)
          ? filter.value
          : [filter.value]

        // Email is currently the default display field for users.
        userDisplay = parseMultiDisplay(
          filterVals.map((val: string) => $rowCache?.[val]?.email ?? val)
        )
      }

      display = userDisplay
    }

    return `${filterOp?.label.toLowerCase()} ${filter.noValue ? "" : display}`
  }
</script>

<FilterPopover
  bind:this={popover}
  {filter}
  {operators}
  {schema}
  {config}
  {buttonText}
  on:change
>
  {buttonText}
  <div slot="anchor">
    <div class="filter-button-wrap" class:inactive={!filter}>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        bind:this={button}
        class:is-disabled={disabled}
        class="new-styles spectrum-Button spectrum-Button--secondary spectrum-Button--size{size.toUpperCase()}"
        title={filterTitle || filterDisplay}
      >
        <div
          class="toggle-wrap"
          on:click={e => {
            if (filter) {
              e.stopPropagation()
            }
            if (!disabled) {
              dispatch("toggle")
            }
          }}
        >
          <Icon name={iconName} {size} />
        </div>

        <span class="spectrum-Button-label" class:truncate>
          <span class="field">{config?.label || config?.field}</span>
          {#if filter}
            <span class="display">
              {filterDisplay}
            </span>
          {/if}
        </span>
        {#if filterMeta}
          <span class="filterMeta">{filterMeta}</span>
        {/if}
      </div>
    </div>
  </div>
</FilterPopover>

<style>
  .toggle-wrap {
    z-index: 1;
  }
  .filter-button-wrap.inactive .spectrum-Button :global(.icon) {
    color: var(--grey-6);
  }

  .spectrum-Button {
    position: relative;
    display: flex;
    gap: var(--spacing-xs);
  }

  .spectrum-Button--sizeM,
  .spectrum-Button--sizeL {
    gap: var(--spacing-s);
  }

  .spectrum-Button--sizeL {
    padding-left: calc(1em * 0.9);
    padding-right: calc(1em * 0.9);
  }

  .spectrum-Button.is-disabled {
    cursor: default;
  }

  .filter-button-wrap.inactive .spectrum-Button {
    background: var(--spectrum-global-color-gray-50);
    border: 1px dashed var(--spectrum-global-color-gray-200);
  }

  .spectrum-Button-label.truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }

  .spectrum-Button-label .display {
    color: var(--spectrum-global-color-blue-600);
  }

  .spectrum-Button--secondary.new-styles {
    background: var(--spectrum-global-color-gray-200);
    border: none;
    border-color: transparent;
    color: var(--spectrum-global-color-gray-900);
  }
  .spectrum-Button--secondary.new-styles:not(.is-disabled):hover {
    background: var(--spectrum-global-color-gray-300);
  }
  .spectrum-Button--secondary.new-styles.is-disabled {
    color: var(--spectrum-global-color-gray-500);
  }
  .spectrum-Button .spectrum-Button-label {
    padding: 0px;
  }
</style>

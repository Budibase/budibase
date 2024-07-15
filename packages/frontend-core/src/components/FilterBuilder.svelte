<script>
  import {
    Body,
    Button,
    Combobox,
    DatePicker,
    Icon,
    Input,
    Layout,
    Select,
    Label,
    Multiselect,
  } from "@budibase/bbui"
  import { ArrayOperator, FieldType } from "@budibase/types"
  import { generate } from "shortid"
  import { QueryUtils, Constants } from "@budibase/frontend-core"
  import { getContext } from "svelte"
  import FilterUsers from "./FilterUsers.svelte"

  const { OperatorOptions, DEFAULT_BB_DATASOURCE_ID } = Constants

  export let schemaFields
  export let filters = []
  export let tables = []
  export let datasource
  export let behaviourFilters = false
  export let allowBindings = false
  export let filtersLabel = "Filters"

  $: {
    if (
      tables.find(
        table =>
          table._id === datasource?.tableId &&
          table.sourceId === DEFAULT_BB_DATASOURCE_ID
      ) &&
      !schemaFields.some(field => field.name === "_id")
    ) {
      schemaFields = [
        ...schemaFields,
        { name: "_id", type: "string" },
        { name: "_rev", type: "string" },
      ]
    }
  }

  $: matchAny = filters?.find(filter => filter.operator === "allOr") != null
  $: onEmptyFilter =
    filters?.find(filter => filter.onEmptyFilter)?.onEmptyFilter ?? "all"

  $: fieldFilters = filters.filter(
    filter => filter.operator !== "allOr" && !filter.onEmptyFilter
  )
  const behaviourOptions = [
    { value: "and", label: "Match all filters" },
    { value: "or", label: "Match any filter" },
  ]
  const onEmptyOptions = [
    { value: "all", label: "Return all table rows" },
    { value: "none", label: "Return no rows" },
  ]
  const context = getContext("context")

  $: fieldOptions = (schemaFields || []).map(field => ({
    label: field.displayName || field.name,
    value: field.name,
  }))

  const addFilter = () => {
    filters = [
      ...(filters || []),
      {
        id: generate(),
        field: null,
        operator: OperatorOptions.Equals.value,
        value: null,
        valueType: "Value",
      },
    ]
  }

  const removeFilter = id => {
    filters = filters.filter(field => field.id !== id)

    // Clear all filters when no fields are specified
    if (filters.length === 1 && filters[0].onEmptyFilter) {
      filters = []
    }
  }

  const duplicateFilter = id => {
    const existingFilter = filters.find(filter => filter.id === id)
    const duplicate = { ...existingFilter, id: generate() }
    filters = [...filters, duplicate]
  }

  const onFieldChange = filter => {
    const previousType = filter.type
    sanitizeTypes(filter)
    sanitizeOperator(filter)
    sanitizeValue(filter, previousType)
  }

  const onOperatorChange = filter => {
    sanitizeOperator(filter)
    sanitizeValue(filter, filter.type)
  }

  const onValueTypeChange = filter => {
    sanitizeValue(filter)
  }

  const getFieldOptions = field => {
    const schema = schemaFields.find(x => x.name === field)
    return schema?.constraints?.inclusion || []
  }

  const getSchema = filter => {
    return schemaFields.find(field => field.name === filter.field)
  }

  const getValidOperatorsForType = filter => {
    if (!filter?.field && !filter?.name) {
      return []
    }

    return QueryUtils.getValidOperatorsForType(
      filter,
      filter.field || filter.name,
      datasource
    )
  }

  $: valueTypeOptions = allowBindings ? ["Value", "Binding"] : ["Value"]

  const sanitizeTypes = filter => {
    // Update type based on field
    const fieldSchema = schemaFields.find(x => x.name === filter.field)
    filter.type = fieldSchema?.type
    filter.subtype = fieldSchema?.subtype
    filter.formulaType = fieldSchema?.formulaType
    filter.constraints = fieldSchema?.constraints

    // Update external type based on field
    filter.externalType = getSchema(filter)?.externalType
  }

  const sanitizeOperator = filter => {
    // Ensure a valid operator is selected
    const operators = getValidOperatorsForType(filter).map(x => x.value)
    if (!operators.includes(filter.operator)) {
      filter.operator = operators[0] ?? OperatorOptions.Equals.value
    }

    // Update the noValue flag if the operator does not take a value
    const noValueOptions = [
      OperatorOptions.Empty.value,
      OperatorOptions.NotEmpty.value,
    ]
    filter.noValue = noValueOptions.includes(filter.operator)
  }

  const sanitizeValue = (filter, previousType) => {
    // Check if the operator allows a value at all
    if (filter.noValue) {
      filter.value = null
      return
    }

    // Ensure array values are properly set and cleared
    if (Array.isArray(filter.value)) {
      if (filter.valueType !== "Value" || filter.type !== FieldType.ARRAY) {
        filter.value = null
      }
    } else if (
      filter.type === FieldType.ARRAY &&
      filter.valueType === "Value"
    ) {
      filter.value = []
    } else if (
      previousType !== filter.type &&
      (previousType === FieldType.BB_REFERENCE ||
        filter.type === FieldType.BB_REFERENCE)
    ) {
      filter.value = filter.type === FieldType.ARRAY ? [] : null
    }
  }

  function handleAllOr(option) {
    filters = filters.filter(f => f.operator !== "allOr")
    if (option === "or") {
      filters.push({ operator: "allOr" })
    }
  }

  function handleOnEmptyFilter(value) {
    filters = filters?.filter(filter => !filter.onEmptyFilter)
    filters.push({ onEmptyFilter: value })
  }
</script>

<div class="container" class:mobile={$context?.device?.mobile}>
  <Layout noPadding>
    {#if fieldOptions?.length}
      <Body size="S">
        {#if !fieldFilters?.length}
          Add your first filter expression.
        {:else}
          <slot name="filtering-hero-content" />
          {#if behaviourFilters}
            <div class="behaviour-filters">
              <Select
                label="Behaviour"
                value={matchAny ? "or" : "and"}
                options={behaviourOptions}
                getOptionLabel={opt => opt.label}
                getOptionValue={opt => opt.value}
                on:change={e => handleAllOr(e.detail)}
                placeholder={null}
              />
              {#if datasource?.type === "table"}
                <Select
                  label="When filter empty"
                  value={onEmptyFilter}
                  options={onEmptyOptions}
                  getOptionLabel={opt => opt.label}
                  getOptionValue={opt => opt.value}
                  on:change={e => handleOnEmptyFilter(e.detail)}
                  placeholder={null}
                />
              {/if}
            </div>
          {/if}
        {/if}
      </Body>
      {#if fieldFilters?.length}
        <div>
          {#if filtersLabel}
            <div class="filter-label">
              <Label>{filtersLabel}</Label>
            </div>
          {/if}
          <div class="fields" class:with-bindings={allowBindings}>
            {#each fieldFilters as filter}
              <Select
                bind:value={filter.field}
                options={fieldOptions}
                on:change={() => onFieldChange(filter)}
                placeholder="Column"
              />
              <Select
                disabled={!filter.field}
                options={getValidOperatorsForType(filter)}
                bind:value={filter.operator}
                on:change={() => onOperatorChange(filter)}
                placeholder={null}
              />
              {#if allowBindings}
                <Select
                  disabled={filter.noValue || !filter.field}
                  options={valueTypeOptions}
                  bind:value={filter.valueType}
                  on:change={() => onValueTypeChange(filter)}
                  placeholder={null}
                />
              {/if}
              {#if allowBindings && filter.field && filter.valueType === "Binding"}
                <slot name="binding" {filter} />
              {:else if [FieldType.STRING, FieldType.LONGFORM, FieldType.NUMBER, FieldType.BIGINT, FieldType.FORMULA].includes(filter.type)}
                <Input disabled={filter.noValue} bind:value={filter.value} />
              {:else if filter.type === FieldType.ARRAY || (filter.type === FieldType.OPTIONS && filter.operator === ArrayOperator.ONE_OF)}
                <Multiselect
                  disabled={filter.noValue}
                  options={getFieldOptions(filter.field)}
                  bind:value={filter.value}
                />
              {:else if filter.type === FieldType.OPTIONS}
                <Combobox
                  disabled={filter.noValue}
                  options={getFieldOptions(filter.field)}
                  bind:value={filter.value}
                />
              {:else if filter.type === FieldType.BOOLEAN}
                <Combobox
                  disabled={filter.noValue}
                  options={[
                    { label: "True", value: "true" },
                    { label: "False", value: "false" },
                  ]}
                  bind:value={filter.value}
                />
              {:else if filter.type === FieldType.DATETIME}
                <DatePicker
                  disabled={filter.noValue}
                  enableTime={!getSchema(filter)?.dateOnly}
                  timeOnly={getSchema(filter)?.timeOnly}
                  bind:value={filter.value}
                />
              {:else if [FieldType.BB_REFERENCE, FieldType.BB_REFERENCE_SINGLE].includes(filter.type)}
                <FilterUsers
                  bind:value={filter.value}
                  multiselect={[
                    OperatorOptions.In.value,
                    OperatorOptions.ContainsAny.value,
                  ].includes(filter.operator)}
                  disabled={filter.noValue}
                  type={filter.valueType}
                />
              {:else}
                <Input disabled />
              {/if}
              <div class="controls">
                <Icon
                  name="Duplicate"
                  hoverable
                  size="S"
                  on:click={() => duplicateFilter(filter.id)}
                />
                <Icon
                  name="Close"
                  hoverable
                  size="S"
                  on:click={() => removeFilter(filter.id)}
                />
              </div>
            {/each}
          </div>
        </div>
      {/if}
      <div>
        <Button icon="AddCircle" size="M" secondary on:click={addFilter}>
          Add filter
        </Button>
      </div>
    {:else}
      <Body size="S">None of the table column can be used for filtering.</Body>
    {/if}
  </Layout>
</div>

<style>
  .container {
    width: 100%;
  }
  .fields {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    align-items: center;
    grid-template-columns: 1fr 120px 1fr auto auto;
  }
  .fields.with-bindings {
    grid-template-columns: minmax(150px, 1fr) 170px 120px minmax(150px, 1fr) 16px 16px;
  }

  .controls {
    display: contents;
  }

  .container.mobile .fields {
    grid-template-columns: 1fr;
  }
  .container.mobile .controls {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: var(--spacing-s) 0;
    gap: var(--spacing-s);
  }

  .filter-label {
    margin-bottom: var(--spacing-s);
  }

  .behaviour-filters {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    align-items: center;
    grid-template-columns: minmax(150px, 1fr) 170px 120px minmax(150px, 1fr) 16px 16px;
  }
</style>

<script>
  import {
    Body,
    Button,
    Combobox,
    Multiselect,
    DatePicker,
    DrawerContent,
    Icon,
    Input,
    Layout,
    Select,
    Label,
  } from "@budibase/bbui"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import ClientBindingPanel from "components/common/bindings/ClientBindingPanel.svelte"
  import { generate } from "shortid"
  import { LuceneUtils, Constants } from "@budibase/frontend-core"
  import { getFields } from "helpers/searchFields"
  import { createEventDispatcher } from "svelte"

  export let schemaFields
  export let filters = []
  export let bindings = []
  export let panel = ClientBindingPanel
  export let allowBindings = true
  export let fillWidth = false
  export let datasource

  const dispatch = createEventDispatcher()
  const { OperatorOptions } = Constants
  const { getValidOperatorsForType } = LuceneUtils
  const KeyedFieldRegex = /\d[0-9]*:/g
  const behaviourOptions = [
    { value: "and", label: "Match all filters" },
    { value: "or", label: "Match any filter" },
  ]

  let rawFilters
  let matchAny = false

  $: parseFilters(filters)
  $: dispatch("change", enrichFilters(rawFilters, matchAny))
  $: enrichedSchemaFields = getFields(schemaFields || [], { allowLinks: true })
  $: fieldOptions = enrichedSchemaFields.map(field => field.name) || []
  $: valueTypeOptions = allowBindings ? ["Value", "Binding"] : ["Value"]

  // Remove field key prefixes and determine whether to use the "match all"
  // or "match any" behaviour
  const parseFilters = filters => {
    matchAny = filters?.find(filter => filter.operator === "allOr") != null
    rawFilters = (filters || [])
      .filter(filter => filter.operator !== "allOr")
      .map(filter => {
        const { field } = filter
        let newFilter = { ...filter }
        delete newFilter.allOr
        if (typeof field === "string" && field.match(KeyedFieldRegex) != null) {
          const parts = field.split(":")
          parts.shift()
          newFilter.field = parts.join(":")
        }
        return newFilter
      })
  }

  // Add field key prefixes and a special metadata filter object to indicate
  // whether to use the "match all" or "match any" behaviour
  const enrichFilters = (rawFilters, matchAny) => {
    let count = 1
    return rawFilters
      .filter(filter => filter.field)
      .map(filter => ({
        ...filter,
        field: `${count++}:${filter.field}`,
      }))
      .concat(matchAny ? [{ operator: "allOr" }] : [])
  }

  const addFilter = () => {
    rawFilters = [
      ...rawFilters,
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
    rawFilters = rawFilters.filter(field => field.id !== id)
  }

  const duplicateFilter = id => {
    const existingFilter = rawFilters.find(filter => filter.id === id)
    const duplicate = { ...existingFilter, id: generate() }
    rawFilters = [...rawFilters, duplicate]
  }

  const getSchema = filter => {
    return schemaFields.find(field => field.name === filter.field)
  }

  const santizeTypes = filter => {
    // Update type based on field
    const fieldSchema = enrichedSchemaFields.find(x => x.name === filter.field)
    filter.type = fieldSchema?.type

    // Update external type based on field
    filter.externalType = getSchema(filter)?.externalType
  }

  const santizeOperator = filter => {
    // Ensure a valid operator is selected
    const operators = getValidOperatorsForType(
      filter.type,
      filter.field,
      datasource
    ).map(x => x.value)
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

  const santizeValue = filter => {
    // Check if the operator allows a value at all
    if (filter.noValue) {
      filter.value = null
      return
    }

    // Ensure array values are properly set and cleared
    if (Array.isArray(filter.value)) {
      if (filter.valueType !== "Value" || filter.type !== "array") {
        filter.value = null
      }
    } else if (filter.type === "array" && filter.valueType === "Value") {
      filter.value = []
    }
  }

  const onFieldChange = filter => {
    santizeTypes(filter)
    santizeOperator(filter)
    santizeValue(filter)
  }

  const onOperatorChange = filter => {
    santizeOperator(filter)
    santizeValue(filter)
  }

  const onValueTypeChange = filter => {
    santizeValue(filter)
  }

  const getFieldOptions = field => {
    const schema = enrichedSchemaFields.find(x => x.name === field)
    return schema?.constraints?.inclusion || []
  }
</script>

<DrawerContent>
  <div class="container">
    <Layout noPadding>
      {#if !rawFilters?.length}
        <Body size="S">Add your first filter expression.</Body>
      {:else}
        <div class="fields">
          <Select
            label="Behaviour"
            value={matchAny ? "or" : "and"}
            options={behaviourOptions}
            getOptionLabel={opt => opt.label}
            getOptionValue={opt => opt.value}
            on:change={e => (matchAny = e.detail === "or")}
            placeholder={null}
          />
        </div>
        <div>
          <div class="filter-label">
            <Label>Filters</Label>
          </div>
          <div class="fields">
            {#each rawFilters as filter, idx}
              <Select
                bind:value={filter.field}
                options={fieldOptions}
                on:change={() => onFieldChange(filter)}
                placeholder="Column"
              />
              <Select
                disabled={!filter.field}
                options={getValidOperatorsForType(
                  filter.type,
                  filter.field,
                  datasource
                )}
                bind:value={filter.operator}
                on:change={() => onOperatorChange(filter)}
                placeholder={null}
              />
              <Select
                disabled={filter.noValue || !filter.field}
                options={valueTypeOptions}
                bind:value={filter.valueType}
                on:change={() => onValueTypeChange(filter)}
                placeholder={null}
              />
              {#if filter.field && filter.valueType === "Binding"}
                <DrawerBindableInput
                  disabled={filter.noValue}
                  title={`Value for "${filter.field}"`}
                  value={filter.value}
                  placeholder="Value"
                  {panel}
                  {bindings}
                  on:change={event => (filter.value = event.detail)}
                  {fillWidth}
                />
              {:else if ["string", "longform", "number", "formula"].includes(filter.type)}
                <Input disabled={filter.noValue} bind:value={filter.value} />
              {:else if filter.type === "array" || (filter.type === "options" && filter.operator === "oneOf")}
                <Multiselect
                  disabled={filter.noValue}
                  options={getFieldOptions(filter.field)}
                  bind:value={filter.value}
                />
              {:else if filter.type === "options"}
                <Combobox
                  disabled={filter.noValue}
                  options={getFieldOptions(filter.field)}
                  bind:value={filter.value}
                />
              {:else if filter.type === "boolean"}
                <Combobox
                  disabled={filter.noValue}
                  options={[
                    { label: "True", value: "true" },
                    { label: "False", value: "false" },
                  ]}
                  bind:value={filter.value}
                />
              {:else if filter.type === "datetime"}
                <DatePicker
                  disabled={filter.noValue}
                  enableTime={!getSchema(filter).dateOnly}
                  timeOnly={getSchema(filter).timeOnly}
                  bind:value={filter.value}
                />
              {:else}
                <DrawerBindableInput disabled />
              {/if}
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
            {/each}
          </div>
        </div>
      {/if}
      <div class="bottom">
        <Button icon="AddCircle" size="M" secondary on:click={addFilter}>
          Add filter
        </Button>
      </div>
    </Layout>
  </div>
</DrawerContent>

<style>
  .container {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
  }

  .fields {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    align-items: center;
    grid-template-columns: minmax(150px, 1fr) 170px 120px minmax(150px, 1fr) 16px 16px;
  }

  .filter-label {
    margin-bottom: var(--spacing-s);
  }

  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>

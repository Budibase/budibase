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
  } from "@budibase/bbui"
  import { generate } from "shortid"
  import { LuceneUtils, Constants } from "@budibase/frontend-core"
  import { getContext } from "svelte"

  export let schemaFields
  export let filters = []
  export let datasource

  const context = getContext("context")
  const BannedTypes = ["link", "attachment", "json"]

  $: fieldOptions = (schemaFields ?? [])
    .filter(
      field =>
        !BannedTypes.includes(field.type) ||
        (field.type === "formula" && field.formulaType === "static")
    )
    .map(field => ({
      label: field.displayName || field.name,
      value: field.name,
    }))

  const addFilter = () => {
    filters = [
      ...filters,
      {
        id: generate(),
        field: null,
        operator: Constants.OperatorOptions.Equals.value,
        value: null,
        valueType: "Value",
      },
    ]
  }

  const removeFilter = id => {
    filters = filters.filter(field => field.id !== id)
  }

  const duplicateFilter = id => {
    const existingFilter = filters.find(filter => filter.id === id)
    const duplicate = { ...existingFilter, id: generate() }
    filters = [...filters, duplicate]
  }

  const onFieldChange = (expression, field) => {
    // Update the field type
    expression.type = schemaFields.find(x => x.name === field)?.type
    expression.externalType = schemaFields.find(
      x => x.name === field
    )?.externalType

    // Ensure a valid operator is set
    const validOperators = LuceneUtils.getValidOperatorsForType(
      { type: expression.type },
      expression.field,
      datasource
    ).map(x => x.value)
    if (!validOperators.includes(expression.operator)) {
      expression.operator =
        validOperators[0] ?? Constants.OperatorOptions.Equals.value
      onOperatorChange(expression, expression.operator)
    }

    // if changed to an array, change default value to empty array
    const idx = filters.findIndex(x => x.field === field)
    if (expression.type === "array") {
      filters[idx].value = []
    } else {
      filters[idx].value = null
    }
  }

  const onOperatorChange = (expression, operator) => {
    const noValueOptions = [
      Constants.OperatorOptions.Empty.value,
      Constants.OperatorOptions.NotEmpty.value,
    ]
    expression.noValue = noValueOptions.includes(operator)
    if (expression.noValue) {
      expression.value = null
    }
  }

  const getFieldOptions = field => {
    const schema = schemaFields.find(x => x.name === field)
    return schema?.constraints?.inclusion || []
  }

  const getSchema = filter => {
    return schemaFields.find(field => field.name === filter.field)
  }
</script>

<div class="container" class:mobile={$context.device.mobile}>
  <Layout noPadding>
    <Body size="S">
      {#if !filters?.length}
        Add your first filter expression.
      {:else}
        Results are filtered to only those which match all of the following
        constraints.
      {/if}
    </Body>
    {#if filters?.length}
      <div class="fields">
        {#each filters as filter}
          <Select
            bind:value={filter.field}
            options={fieldOptions}
            on:change={e => onFieldChange(filter, e.detail)}
            placeholder="Column"
          />
          <Select
            disabled={!filter.field}
            options={LuceneUtils.getValidOperatorsForType(
              { type: filter.type, subtype: filter.subtype },
              filter.field,
              datasource
            )}
            bind:value={filter.operator}
            on:change={e => onOperatorChange(filter, e.detail)}
            placeholder={null}
          />
          {#if ["string", "longform", "number", "bigint", "formula"].includes(filter.type)}
            <Input disabled={filter.noValue} bind:value={filter.value} />
          {:else if ["options", "array"].includes(filter.type)}
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
    {/if}
    <div>
      <Button icon="AddCircle" size="M" secondary on:click={addFilter}>
        Add filter
      </Button>
    </div>
  </Layout>
</div>

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
    grid-template-columns: 1fr 120px 1fr auto auto;
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
</style>

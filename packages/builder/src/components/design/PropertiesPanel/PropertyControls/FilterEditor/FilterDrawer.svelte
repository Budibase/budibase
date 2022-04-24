<script>
  import {
    Body,
    Button,
    Combobox,
    DatePicker,
    DrawerContent,
    Icon,
    Input,
    Layout,
    Select,
  } from "@budibase/bbui"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import ClientBindingPanel from "components/common/bindings/ClientBindingPanel.svelte"
  import { generate } from "shortid"
  import { LuceneUtils, Constants } from "@budibase/frontend-core"
  import { getFields } from "helpers/searchFields"

  export let schemaFields
  export let filters = []
  export let bindings = []
  export let panel = ClientBindingPanel
  export let allowBindings = true

  const validFormulaTypeOptions = [
    {
      value: "string",
      label: "Text",
    },
    {
      value: "number",
      label: "Number",
    },
    {
      value: "datetime",
      label: "Date",
    },
  ]

  $: enrichedSchemaFields = getFields(schemaFields || [])
  $: fieldOptions = enrichedSchemaFields.map(field => field.name) || []
  $: validFormulaTypeOptions[0].label = allowBindings ? "Binding" : "Text"

  const addFilter = () => {
    filters = [
      ...filters,
      {
        id: generate(),
        field: null,
        fieldType: null,
        operator: Constants.OperatorOptions.Equals.value,
        value: null,
        valueType: validFormulaTypeOptions[0].label,
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

  const onValueTypeChange = (expression, valueType) => {
    let valueTypeLabel = validFormulaTypeOptions.find(
      option => option.value === valueType
    )?.label
    if (!valueTypeLabel) return

    if (valueType === "datetime") {
      if (isNaN(expression.value)) expression.value = new Date(0)
      else expression.value = new Date(Number(expression.value))
    } else if (valueType === "number") {
      if (isNaN(expression.value)) expression.value = 0
      else expression.value = Number(expression.value)
    } else if (valueType === "string") {
      if (typeof expression.value === "object")
        expression.value = expression.value.getTime().toString()
      else expression.value = expression.value?.toString()
    }

    expression.valueType = valueTypeLabel
    expression.type = valueType
  }

  const onFieldChange = (expression, field) => {
    // Update the field type
    expression.type = enrichedSchemaFields.find(x => x.name === field)?.type
    expression.fieldType = expression.type

    // Ensure a valid operator is set
    const validOperators = LuceneUtils.getValidOperatorsForType(
      expression.type
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

    if (expression.fieldType !== "formula")
      expression.valueType = allowBindings ? "Binding" : "Value"
    else if (expression.valueType === "Value")
      expression.valueType = allowBindings ? "Binding" : "Text"
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
    const schema = enrichedSchemaFields.find(x => x.name === field)
    return schema?.constraints?.inclusion || []
  }

  const getValueTypeOptions = fieldType => {
    return fieldType === "formula"
      ? validFormulaTypeOptions
      : allowBindings
      ? ["Binding", "Value"]
      : ["Value"]
  }
</script>

<DrawerContent>
  <div class="container">
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
          {#each filters as filter, idx}
            <Select
              bind:value={filter.field}
              options={fieldOptions}
              on:change={e => onFieldChange(filter, e.detail)}
              placeholder="Column"
            />
            <Select
              disabled={!filter.field}
              options={LuceneUtils.getValidOperatorsForType(filter.type)}
              bind:value={filter.operator}
              on:change={e => onOperatorChange(filter, e.detail)}
              placeholder={null}
            />
            <Select
              disabled={filter.noValue || !filter.field}
              options={getValueTypeOptions(filter.fieldType)}
              bind:value={filter.valueType}
              placeholder={null}
              on:change={e => onValueTypeChange(filter, e.detail)}
            />
            {#if filter.valueType === "Binding"}
              <DrawerBindableInput
                disabled={filter.noValue || !filter.field}
                title={`Value for "${filter.field}"`}
                value={filter.value}
                placeholder="Value"
                {panel}
                {bindings}
                on:change={event => (filter.value = event.detail)}
              />
            {:else if ["string", "longform", "number", "formula"].includes(filter.type)}
              <Input
                disabled={filter.noValue || !filter.field}
                bind:value={filter.value}
              />
            {:else if ["options", "array"].includes(filter.type)}
              <Combobox
                disabled={filter.noValue || !filter.field}
                options={getFieldOptions(filter.field)}
                bind:value={filter.value}
              />
            {:else if filter.type === "boolean"}
              <Combobox
                disabled={filter.noValue || !filter.field}
                options={[
                  { label: "True", value: "true" },
                  { label: "False", value: "false" },
                ]}
                bind:value={filter.value}
              />
            {:else if filter.type === "datetime"}
              <DatePicker
                disabled={filter.noValue || !filter.field}
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
      {/if}
      <div>
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
    grid-template-columns: 1fr 120px 120px 1fr auto auto;
  }
</style>

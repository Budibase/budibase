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
  import BindingPanel from "components/common/bindings/BindingPanel.svelte"
  import { generate } from "shortid"
  import { getValidOperatorsForType, OperatorOptions } from "helpers/lucene"

  export let schemaFields
  export let filters = []
  export let bindings = []
  export let panel = BindingPanel

  const BannedTypes = ["link", "attachment", "formula"]

  $: fieldOptions = (schemaFields ?? [])
    .filter(field => !BannedTypes.includes(field.type))
    .map(field => field.name)

  const addFilter = () => {
    filters = [
      ...filters,
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
  }

  const duplicateFilter = id => {
    const existingFilter = filters.find(filter => filter.id === id)
    const duplicate = { ...existingFilter, id: generate() }
    filters = [...filters, duplicate]
  }

  const onFieldChange = (expression, field) => {
    // Update the field type
    expression.type = schemaFields.find(x => x.name === field)?.type

    // Ensure a valid operator is set
    const validOperators = getValidOperatorsForType(expression.type).map(
      x => x.value
    )
    if (!validOperators.includes(expression.operator)) {
      expression.operator = validOperators[0] ?? OperatorOptions.Equals.value
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
      OperatorOptions.Empty.value,
      OperatorOptions.NotEmpty.value,
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
</script>

<DrawerContent>
  <div class="container">
    <Layout noPadding>
      <Body size="S">
        {#if !filters?.length}
          Add your first filter column.
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
              options={getValidOperatorsForType(filter.type)}
              bind:value={filter.operator}
              on:change={e => onOperatorChange(filter, e.detail)}
              placeholder={null}
            />
            <Select
              disabled={filter.noValue || !filter.field}
              options={["Value", "Binding"]}
              bind:value={filter.valueType}
              placeholder={null}
            />
            {#if filter.valueType === "Binding"}
              <DrawerBindableInput
                disabled={filter.noValue}
                title={`Value for "${filter.field}"`}
                value={filter.value}
                placeholder="Value"
                {panel}
                {bindings}
                on:change={event => (filter.value = event.detail)}
              />
            {:else if ["string", "longform", "number"].includes(filter.type)}
              <Input disabled={filter.noValue} bind:value={filter.value} />
            {:else if filter.type === "options" || "array"}
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
              <DatePicker disabled={filter.noValue} bind:value={filter.value} />
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

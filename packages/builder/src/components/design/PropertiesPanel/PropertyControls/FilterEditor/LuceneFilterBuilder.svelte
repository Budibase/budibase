<script>
  import {
    DatePicker,
    ActionButton,
    Button,
    Select,
    Combobox,
    Input,
  } from "@budibase/bbui"
  import { store, currentAsset } from "builderStore"
  import { getBindableProperties } from "builderStore/dataBinding"
  import { createEventDispatcher } from "svelte"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import { generate } from "shortid"

  const dispatch = createEventDispatcher()

  export let schemaFields
  export let value

  const OperatorOptions = {
    Equals: {
      value: "equal",
      label: "Equals",
    },
    NotEquals: {
      value: "notEqual",
      label: "Not equals",
    },
    Empty: {
      value: "empty",
      label: "Is empty",
    },
    NotEmpty: {
      value: "notEmpty",
      label: "Is not empty",
    },
    StartsWith: {
      value: "string",
      label: "Starts with",
    },
    Like: {
      value: "fuzzy",
      label: "Like",
    },
    MoreThan: {
      value: "rangeLow",
      label: "More than",
    },
    LessThan: {
      value: "rangeHigh",
      label: "Less than",
    },
  }
  const BannedTypes = ["link", "attachment"]
  $: bindableProperties = getBindableProperties(
    $currentAsset,
    $store.selectedComponentId
  )
  $: fieldOptions = (schemaFields ?? [])
    .filter(field => !BannedTypes.includes(field.type))
    .map(field => field.name)

  const addField = () => {
    value = [
      ...value,
      {
        id: generate(),
        field: null,
        operator: OperatorOptions.Equals.value,
        value: null,
        valueType: "Value",
      },
    ]
  }

  const removeField = id => {
    value = value.filter(field => field.id !== id)
  }

  const getValidOperatorsForType = type => {
    const Op = OperatorOptions
    if (type === "string") {
      return [
        Op.Equals,
        Op.NotEquals,
        Op.StartsWith,
        Op.Like,
        Op.Empty,
        Op.NotEmpty,
      ]
    } else if (type === "number") {
      return [
        Op.Equals,
        Op.NotEquals,
        Op.MoreThan,
        Op.LessThan,
        Op.Empty,
        Op.NotEmpty,
      ]
    } else if (type === "options") {
      return [Op.Equals, Op.NotEquals, Op.Empty, Op.NotEmpty]
    } else if (type === "boolean") {
      return [Op.Equals, Op.NotEquals, Op.Empty, Op.NotEmpty]
    } else if (type === "longform") {
      return [
        Op.Equals,
        Op.NotEquals,
        Op.StartsWith,
        Op.Like,
        Op.Empty,
        Op.NotEmpty,
      ]
    } else if (type === "datetime") {
      return [
        Op.Equals,
        Op.NotEquals,
        Op.MoreThan,
        Op.LessThan,
        Op.Empty,
        Op.NotEmpty,
      ]
    }
    return []
  }

  const onFieldChange = (expression, field) => {
    // Update the field type
    expression.type = schemaFields.find(x => x.name === field)?.type

    // Ensure a valid operator is set
    const validOperators = getValidOperatorsForType(expression.type)
    if (!validOperators.includes(expression.operator)) {
      expression.operator =
        validOperators[0]?.value ?? OperatorOptions.Equals.value
      onOperatorChange(expression, expression.operator)
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

{#if value?.length}
  <div class="fields">
    {#each value as expression, idx}
      <Select
        bind:value={expression.field}
        options={fieldOptions}
        on:change={e => onFieldChange(expression, e.detail)}
        placeholder="Column"
      />
      <Select
        disabled={!expression.field}
        options={getValidOperatorsForType(expression.type)}
        bind:value={expression.operator}
        on:change={e => onOperatorChange(expression, e.detail)}
        placeholder={null}
      />
      <Select
        disabled={expression.noValue || !expression.field}
        options={["Value", "Binding"]}
        bind:value={expression.valueType}
        placeholder={null}
      />
      {#if expression.valueType === "Binding"}
        <DrawerBindableInput
          disabled={expression.noValue}
          title={`Value for "${expression.field}"`}
          value={expression.value}
          placeholder="Value"
          bindings={bindableProperties}
          on:change={event => (expression.value = event.detail)}
        />
      {:else if ["string", "longform", "number"].includes(expression.type)}
        <Input disabled={expression.noValue} bind:value={expression.value} />
      {:else if expression.type === "options"}
        <Combobox
          disabled={expression.noValue}
          options={getFieldOptions(expression.field)}
          bind:value={expression.value}
        />
      {:else if expression.type === "boolean"}
        <Combobox
          disabled={expression.noValue}
          options={[
            { label: "True", value: "true" },
            { label: "False", value: "false" },
          ]}
          bind:value={expression.value}
        />
      {:else if expression.type === "datetime"}
        <DatePicker
          disabled={expression.noValue}
          bind:value={expression.value}
        />
      {:else}
        <DrawerBindableInput disabled />
      {/if}

      <ActionButton
        size="S"
        quiet
        icon="Close"
        on:click={() => removeField(expression.id)}
      />
    {/each}
  </div>
{/if}
<div>
  <Button icon="AddCircle" size="M" secondary on:click={addField}>
    Add expression
  </Button>
</div>

<style>
  .fields {
    display: grid;
    column-gap: var(--spacing-l);
    row-gap: var(--spacing-s);
    align-items: center;
    grid-template-columns: 1fr 120px 120px 1fr auto;
  }
</style>

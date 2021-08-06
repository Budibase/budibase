<script>
  import {
    Button,
    Icon,
    DrawerContent,
    Layout,
    Select,
    Heading,
    Body,
  } from "@budibase/bbui"
  import { currentAsset, selectedComponent } from "builderStore"
  import { findClosestMatchingComponent } from "builderStore/storeUtils"
  import { getSchemaForDatasource } from "builderStore/dataBinding"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"

  export let rules = []
  export let bindings = []
  export let type

  const Constraints = {
    Required: {
      label: "Required",
      value: "required",
    },
    MaxLength: {
      label: "Max length",
      value: "maxLength",
    },
    MaxValue: {
      label: "Max value",
      value: "maxValue",
    },
    MinValue: {
      label: "Min value",
      value: "minValue",
    },
    Equal: {
      label: "Must equal",
      value: "equal",
    },
    NotEqual: {
      label: "Must not equal",
      value: "notEqual",
    },
    Regex: {
      label: "Must match regex",
      value: "regex",
    },
    NotRegex: {
      label: "Must not match regex",
      value: "notRegex",
    },
    Contains: {
      label: "Must contain row ID",
      value: "contains",
    },
    NotContains: {
      label: "Must not contain row ID",
      value: "notContains",
    },
  }
  const ConstraintMap = {
    ["string"]: [
      Constraints.Required,
      Constraints.MaxLength,
      Constraints.Equal,
      Constraints.NotEqual,
      Constraints.Regex,
      Constraints.NotRegex,
    ],
    ["number"]: [
      Constraints.Required,
      Constraints.MaxValue,
      Constraints.MinValue,
      Constraints.Equal,
      Constraints.NotEqual,
    ],
    ["boolean"]: [
      Constraints.Required,
      Constraints.Equal,
      Constraints.NotEqual,
    ],
    ["datetime"]: [
      Constraints.Required,
      Constraints.MaxValue,
      Constraints.MinValue,
      Constraints.Equal,
      Constraints.NotEqual,
    ],
    ["attachment"]: [Constraints.Required],
    ["link"]: [
      Constraints.Required,
      Constraints.Equal,
      Constraints.NotEqual,
      Constraints.Contains,
      Constraints.NotContains,
    ],
  }

  $: dataSourceSchema = getDataSourceSchema($currentAsset, $selectedComponent)
  $: field = $selectedComponent?.field
  $: schemaRules = parseRulesFromSchema(field, dataSourceSchema || {})
  $: constraintOptions = getConstraintsForType(type)

  const getConstraintsForType = type => {
    return ConstraintMap[type?.split("/")[1] || "string"]
  }

  const getDataSourceSchema = (asset, component) => {
    if (!asset || !component) {
      return null
    }
    const formParent = findClosestMatchingComponent(
      asset.props,
      component._id,
      component => component._component.endsWith("/form")
    )
    return getSchemaForDatasource(asset, formParent?.dataSource)
  }

  const parseRulesFromSchema = (field, dataSourceSchema) => {
    if (!field || !dataSourceSchema) {
      return []
    }
    const fieldSchema = dataSourceSchema.schema?.[field]
    const constraints = fieldSchema?.constraints
    if (!constraints) {
      return []
    }
    let rules = []

    // Required constraint
    if (
      field === dataSourceSchema?.table?.primaryDisplay ||
      constraints.presence?.allowEmpty === false
    ) {
      rules.push({
        constraint: "required",
        error: "Required field",
      })
    }

    // String length constraint
    if (exists(constraints.length?.maximum)) {
      const length = constraints.length.maximum
      rules.push({
        constraint: "maxLength",
        constraintValue: length,
        error: `Maximum ${length} characters`,
      })
    }

    // Min / max number constraint
    if (exists(constraints.numericality?.greaterThanOrEqualTo)) {
      const min = constraints.numericality.greaterThanOrEqualTo
      rules.push({
        constraint: "minValue",
        constraintValue: min,
        error: `Minimum value is ${min}`,
      })
    }
    if (exists(constraints.numericality?.lessThanOrEqualTo)) {
      const max = constraints.numericality.lessThanOrEqualTo
      rules.push({
        constraint: "maxValue",
        constraintValue: max,
        error: `Maximum value is ${max}`,
      })
    }

    return rules
  }

  const exists = value => {
    return value != null && value !== ""
  }

  const addRule = () => {
    rules = [...(rules || []), {}]
  }

  const removeRule = id => {
    rules = rules.filter(link => link.id !== id)
  }
</script>

<DrawerContent>
  <div class="container">
    <Layout noPadding gap="M">
      <Layout noPadding gap={schemaRules?.length ? "S" : "XS"}>
        <Heading size="XS">Schema validation rules</Heading>
        {#if schemaRules?.length}
          <div class="links">
            {#each schemaRules as rule}
              <div class="rule schema">
                <Select
                  placeholder="Constraint"
                  value={rule.constraint}
                  options={constraintOptions}
                  disabled
                />
                <DrawerBindableInput
                  placeholder="Constraint value"
                  value={rule.constraintValue}
                  {bindings}
                  disabled
                />
                <DrawerBindableInput
                  placeholder="Error message"
                  value={rule.error}
                  {bindings}
                  disabled
                />
                <div />
              </div>
            {/each}
          </div>
        {:else}
          <Body size="S">
            There are no built-in validation rules from the schema.
          </Body>
        {/if}
      </Layout>
      <Layout noPadding gap="S">
        <Heading size="XS">Custom validation rules</Heading>
        {#if rules?.length}
          <div class="links">
            {#each rules as rule}
              <div class="rule">
                <Select
                  bind:value={rule.constraint}
                  options={constraintOptions}
                  placeholder="Constraint"
                />
                <DrawerBindableInput
                  placeholder="Constraint value"
                  value={rule.constraintValue}
                  {bindings}
                  disabled={rule.constraint === "required"}
                  on:change={e => (rule.constraintValue = e.detail)}
                />
                <DrawerBindableInput
                  placeholder="Error message"
                  value={rule.error}
                  {bindings}
                  on:change={e => (rule.error = e.detail)}
                />
                <Icon
                  name="Close"
                  hoverable
                  size="S"
                  on:click={() => removeRule(rule.id)}
                />
              </div>
            {/each}
          </div>
        {/if}
        <div class="button">
          <Button secondary icon="Add" on:click={addRule}>Add Rule</Button>
        </div>
      </Layout>
    </Layout>
  </div>
</DrawerContent>

<style>
  .container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }
  .links {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-m);
  }

  .rule {
    gap: var(--spacing-l);
    display: grid;
    align-items: center;
    grid-template-columns: 1fr 1fr 1fr 20px;
    border-radius: var(--border-radius-s);
    transition: background-color ease-in-out 130ms;
  }
</style>

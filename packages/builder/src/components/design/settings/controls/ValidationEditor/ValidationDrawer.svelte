<script>
  import {
    Button,
    Icon,
    DrawerContent,
    Layout,
    Select,
    Heading,
    Body,
    Input,
    DatePicker,
  } from "@budibase/bbui"
  import { currentAsset, selectedComponent } from "builderStore"
  import { findClosestMatchingComponent } from "builderStore/componentUtils"
  import { getSchemaForDatasource } from "builderStore/dataBinding"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import { generate } from "shortid"

  export let fieldName = null
  export let rules = []
  export let bindings = []
  export let type

  const Constraints = {
    Required: {
      label: "Required",
      value: "required",
    },
    MinLength: {
      label: "Min length",
      value: "minLength",
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
      label: "Must contain",
      value: "contains",
    },
    NotContains: {
      label: "Must not contain",
      value: "notContains",
    },
    MaxFileSize: {
      label: "Max file size (MB)",
      value: "maxFileSize",
    },
    MaxUploadSize: {
      label: "Max total upload size (MB)",
      value: "maxUploadSize",
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
    ["attachment"]: [
      Constraints.Required,
      Constraints.MaxFileSize,
      Constraints.MaxUploadSize,
    ],
    ["link"]: [
      Constraints.Required,
      Constraints.Contains,
      Constraints.NotContains,
      Constraints.MinLength,
      Constraints.MaxLength,
    ],
    ["array"]: [
      Constraints.Required,
      Constraints.MinLength,
      Constraints.MaxLength,
      Constraints.Contains,
      Constraints.NotContains,
    ],
  }

  $: dataSourceSchema = getDataSourceSchema($currentAsset, $selectedComponent)
  $: field = fieldName || $selectedComponent?.field
  $: schemaRules = parseRulesFromSchema(field, dataSourceSchema || {})
  $: fieldType = type?.split("/")[1] || "string"
  $: constraintOptions = getConstraintsForType(fieldType)

  const getConstraintsForType = type => {
    return ConstraintMap[type]
  }

  const getDataSourceSchema = (asset, component) => {
    if (!asset || !component) {
      return null
    }
    const formParent = findClosestMatchingComponent(
      asset.props,
      component._id,
      component =>
        component._component.endsWith("/form") ||
        component._component.endsWith("/formblock") ||
        component._component.endsWith("/tableblock")
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
        value: length,
        error: `Maximum ${length} characters`,
      })
    }

    // Min / max number constraint
    if (exists(constraints.numericality?.greaterThanOrEqualTo)) {
      const min = constraints.numericality.greaterThanOrEqualTo
      rules.push({
        constraint: "minValue",
        value: min,
        error: `Minimum value is ${min}`,
      })
    }
    if (exists(constraints.numericality?.lessThanOrEqualTo)) {
      const max = constraints.numericality.lessThanOrEqualTo
      rules.push({
        constraint: "maxValue",
        value: max,
        error: `Maximum value is ${max}`,
      })
    }

    return rules
  }

  const exists = value => {
    return value != null && value !== ""
  }

  const addRule = () => {
    rules = [
      ...(rules || []),
      {
        valueType: "Binding",
        type: fieldType,
        id: generate(),
        value: fieldType == "array" ? [] : null,
      },
    ]
  }

  const removeRule = id => {
    rules = rules.filter(link => link.id !== id)
  }

  const duplicateRule = id => {
    const existingRule = rules.find(rule => rule.id === id)
    const newRule = { ...existingRule, id: generate() }
    rules = [...rules, newRule]
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
                <Select
                  placeholder={null}
                  value="Value"
                  options={["Binding", "Value"]}
                  disabled
                />
                <DrawerBindableInput
                  placeholder="Constraint value"
                  value={rule.value}
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
            {#each rules as rule (rule.id)}
              <div class="rule">
                <Select
                  bind:value={rule.constraint}
                  options={constraintOptions}
                  placeholder="Constraint"
                />
                <Select
                  disabled={rule.constraint === "required"}
                  placeholder={null}
                  bind:value={rule.valueType}
                  options={["Binding", "Value"]}
                />

                {#if rule.valueType === "Binding"}
                  <!-- Bindings always get a bindable input -->
                  <DrawerBindableInput
                    placeholder="Constraint value"
                    value={rule.value}
                    {bindings}
                    disabled={rule.constraint === "required"}
                    on:change={e => (rule.value = e.detail)}
                  />
                {:else if rule.type !== "array" && ["maxUploadSize", "maxFileSize", "maxLength", "minLength", "regex", "notRegex", "contains", "notContains"].includes(rule.constraint)}
                  <!-- Certain constraints always need string values-->
                  <Input
                    bind:value={rule.value}
                    placeholder="Constraint value"
                  />
                {:else}
                  <!-- Otherwise we render a component based on the type -->
                  {#if ["string", "number", "options", "longform"].includes(rule.type)}
                    <Input
                      disabled={rule.constraint === "required"}
                      bind:value={rule.value}
                      placeholder="Constraint value"
                    />
                  {:else if rule.type === "array"}
                    <Select
                      disabled={rule.constraint === "required"}
                      options={dataSourceSchema.schema[field].constraints
                        .inclusion}
                      getOptionLabel={x => x}
                      getOptionValue={x => x}
                      value={rule.value}
                      on:change={e => {
                        rule.value = e.detail
                      }}
                    />
                  {:else if rule.type === "boolean"}
                    <Select
                      disabled={rule.constraint === "required"}
                      options={[
                        { label: "True", value: "true" },
                        { label: "False", value: "false" },
                      ]}
                      bind:value={rule.value}
                    />
                  {:else if rule.type === "datetime"}
                    <DatePicker
                      enableTime={false}
                      disabled={rule.constraint === "required"}
                      bind:value={rule.value}
                    />
                  {:else}
                    <DrawerBindableInput disabled />
                  {/if}
                {/if}
                <DrawerBindableInput
                  placeholder="Error message"
                  value={rule.error}
                  {bindings}
                  on:change={e => (rule.error = e.detail)}
                />
                <Icon
                  name="Duplicate"
                  hoverable
                  size="S"
                  on:click={() => duplicateRule(rule.id)}
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
    max-width: 1000px;
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
    grid-template-columns: 200px 120px 1fr 1fr auto auto;
    border-radius: var(--border-radius-s);
    transition: background-color ease-in-out 130ms;
  }
</style>

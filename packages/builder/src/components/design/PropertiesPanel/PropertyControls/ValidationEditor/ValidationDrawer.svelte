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
  import { findClosestMatchingComponent } from "builderStore/storeUtils"
  import { getSchemaForDatasource } from "builderStore/dataBinding"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import { generate } from "shortid"
  import { _ as t } from "svelte-i18n"

  export let rules = []
  export let bindings = []
  export let type

  const Constraints = {
    Required: {
      label: $t("required"),
      value: "required",
    },
    MinLength: {
      label: $t("min-length"),
      value: "minLength",
    },
    MaxLength: {
      label: $t("max-length"),
      value: "maxLength",
    },
    MaxValue: {
      label: $t("max-value"),
      value: "maxValue",
    },
    MinValue: {
      label: $t("min-value"),
      value: "minValue",
    },
    Equal: {
      label: $t("must-equal"),
      value: "equal",
    },
    NotEqual: {
      label: $t("must-not-equal"),
      value: "notEqual",
    },
    Regex: {
      label: $t("must-match-regex"),
      value: "regex",
    },
    NotRegex: {
      label: $t("must-not-match-regex"),
      value: "notRegex",
    },
    Contains: {
      label: $t("must-contain-row-id"),
      value: "contains",
    },
    NotContains: {
      label: $t("must-not-contain-row-id"),
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
      Constraints.Contains,
      Constraints.NotContains,
      Constraints.MinLength,
      Constraints.MaxLength,
    ],
  }

  $: dataSourceSchema = getDataSourceSchema($currentAsset, $selectedComponent)
  $: field = $selectedComponent?.field
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
        error: $t("required-field"),
      })
    }

    // String length constraint
    if (exists(constraints.length?.maximum)) {
      const length = constraints.length.maximum
      rules.push({
        constraint: "maxLength",
        value: length,
        error: $t("maximum") + ` ${length} ` + $t("characters"),
      })
    }

    // Min / max number constraint
    if (exists(constraints.numericality?.greaterThanOrEqualTo)) {
      const min = constraints.numericality.greaterThanOrEqualTo
      rules.push({
        constraint: "minValue",
        value: min,
        error: $t("minimum-value-is") + ` ${min}`,
      })
    }
    if (exists(constraints.numericality?.lessThanOrEqualTo)) {
      const max = constraints.numericality.lessThanOrEqualTo
      rules.push({
        constraint: "maxValue",
        value: max,
        error: $t("maximum-value-is") + ` ${max}`,
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
        <Heading size="XS">{$t("schema-validation-rules")}</Heading>
        {#if schemaRules?.length}
          <div class="links">
            {#each schemaRules as rule}
              <div class="rule schema">
                <Select
                  placeholder={$t("constraint")}
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
                  placeholder={$t("constraint-value")}
                  value={rule.value}
                  {bindings}
                  disabled
                />
                <DrawerBindableInput
                  placeholder={$t("error-message")}
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
            {$t("there-are-no-built-in-validation-rules-from-the-schema")}
          </Body>
        {/if}
      </Layout>
      <Layout noPadding gap="S">
        <Heading size="XS">{$t("custom-validation-rules")}</Heading>
        {#if rules?.length}
          <div class="links">
            {#each rules as rule (rule.id)}
              <div class="rule">
                <Select
                  bind:value={rule.constraint}
                  options={constraintOptions}
                  placeholder={$t("constraint")}
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
                    placeholder={$t("constraint-value")}
                    value={rule.value}
                    {bindings}
                    disabled={rule.constraint === "required"}
                    on:change={e => (rule.value = e.detail)}
                  />
                {:else if ["maxLength", "minLength", "regex", "notRegex", "contains", "notContains"].includes(rule.constraint)}
                  <!-- Certain constraints always need string values-->
                  <Input
                    bind:value={rule.value}
                    placeholder={$t("constraint-value")}
                  />
                {:else}
                  <!-- Otherwise we render a component based on the type -->
                  {#if ["string", "number", "options", "longform"].includes(rule.type)}
                    <Input
                      disabled={rule.constraint === "required"}
                      bind:value={rule.value}
                      placeholder={$t("constraint-value")}
                    />
                  {:else if rule.type === "boolean"}
                    <Select
                      disabled={rule.constraint === "required"}
                      options={[
                        { label: $t("true"), value: "true" },
                        { label: $t("false"), value: "false" },
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
                  placeholder={$t("error-message")}
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
          <Button secondary icon="Add" on:click={addRule}
            >{$t("add-rule")}</Button
          >
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
    grid-template-columns: 190px 120px 1fr 1fr auto auto;
    border-radius: var(--border-radius-s);
    transition: background-color ease-in-out 130ms;
  }
</style>

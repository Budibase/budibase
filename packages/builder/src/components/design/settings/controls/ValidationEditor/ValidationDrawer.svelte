<script lang="ts">
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
    Label,
  } from "@budibase/bbui"
  import type { Component, EnrichedBinding } from "@budibase/types"
  import { isJSBinding } from "@budibase/string-templates"
  import { generate } from "shortid"
  import { selectedScreen, selectedComponent } from "@/stores/builder"
  import { findClosestMatchingComponent } from "@/helpers/components"
  import {
    getSchemaForDatasource,
    getDatasourceForProvider,
  } from "@/dataBinding"
  import {
    defaultErrorForConstraint,
    getConstraintsForType,
  } from "./constraints"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"
  import SchemaRulesSummary from "./SchemaRulesSummary.svelte"
  import ValidationRuleCard from "./ValidationRuleCard.svelte"
  import type {
    SchemaValidationRule,
    ValidationEditorRule,
    ValidationValue,
  } from "./types"

  type InputValue = string | number | null | undefined

  interface ScreenAsset {
    props: Component
  }

  interface DatasourceSchema {
    schema?: Record<string, { constraints?: SchemaConstraints }>
    table?: { primaryDisplay?: string }
  }

  interface SchemaConstraints {
    presence?: boolean | { allowEmpty?: boolean }
    length?: { minimum?: ValidationValue; maximum?: ValidationValue }
    numericality?: {
      greaterThanOrEqualTo?: ValidationValue
      lessThanOrEqualTo?: ValidationValue
    }
    inclusion?: string[]
  }

  const stringConstraints: string[] = [
    "maxUploadSize",
    "maxFileSize",
    "maxLength",
    "minLength",
    "regex",
    "notRegex",
    "contains",
    "notContains",
  ]

  export let fieldName: string | null = null
  export let rules: ValidationEditorRule[] = []
  export let bindings: EnrichedBinding[] = []
  export let type: string | undefined = undefined

  const getInitialExpandedRules = (
    rules: ValidationEditorRule[]
  ): Set<string> => {
    const expanded = new Set<string>()
    if (rules?.length <= 2) {
      rules.forEach(rule => {
        if (rule?.id) {
          expanded.add(rule.id)
        }
      })
    }
    return expanded
  }

  let expandedRules: Set<string> = getInitialExpandedRules(rules)

  const resolveDatasource = (
    selectedScreen: ScreenAsset,
    componentInstance: Component,
    parent: Component | null
  ): unknown => {
    return (
      getDatasourceForProvider(selectedScreen, parent || componentInstance) ||
      {}
    )
  }

  $: dataSourceSchema = getDataSourceSchema($selectedScreen, $selectedComponent)
  $: field = fieldName || $selectedComponent?.field
  $: schemaRules = parseRulesFromSchema(field, dataSourceSchema || {})
  $: fieldType = type?.split("/")[1] || "string"
  $: constraintOptions = getConstraintsForType(fieldType)

  const getDataSourceSchema = (
    asset: ScreenAsset | null | undefined,
    component: Component | null | undefined
  ): DatasourceSchema | null => {
    if (!asset || !component) {
      return null
    }
    const formParent = findClosestMatchingComponent(
      asset.props,
      component._id,
      (component: Component) =>
        component._component.endsWith("/form") ||
        component._component.endsWith("/formblock") ||
        component._component.endsWith("/tableblock")
    )
    const dataSource = resolveDatasource(asset, component, formParent)
    return getSchemaForDatasource(asset, dataSource, {}) as DatasourceSchema
  }

  const parseRulesFromSchema = (
    field: string | null | undefined,
    dataSourceSchema: DatasourceSchema
  ): SchemaValidationRule[] => {
    if (!field || !dataSourceSchema) {
      return []
    }
    const fieldSchema = dataSourceSchema.schema?.[field]
    const constraints = fieldSchema?.constraints
    if (!constraints) {
      return []
    }
    let rules: SchemaValidationRule[] = []

    const presence = constraints.presence

    // Required constraint
    if (
      field === dataSourceSchema?.table?.primaryDisplay ||
      (typeof presence === "object" && presence?.allowEmpty === false) ||
      presence === true
    ) {
      rules.push({
        constraint: "required",
        error: defaultErrorForConstraint("required", null),
      })
    }

    // String length constraint
    if (exists(constraints.length?.minimum)) {
      const length = constraints.length?.minimum
      rules.push({
        constraint: "minLength",
        value: length,
        error: defaultErrorForConstraint("minLength", length),
      })
    }
    if (exists(constraints.length?.maximum)) {
      const length = constraints.length?.maximum
      rules.push({
        constraint: "maxLength",
        value: length,
        error: defaultErrorForConstraint("maxLength", length),
      })
    }

    // Min / max number constraint
    if (exists(constraints.numericality?.greaterThanOrEqualTo)) {
      const min = constraints.numericality?.greaterThanOrEqualTo
      rules.push({
        constraint: "minValue",
        value: min,
        error: defaultErrorForConstraint("minValue", min),
      })
    }
    if (exists(constraints.numericality?.lessThanOrEqualTo)) {
      const max = constraints.numericality?.lessThanOrEqualTo
      rules.push({
        constraint: "maxValue",
        value: max,
        error: defaultErrorForConstraint("maxValue", max),
      })
    }

    return rules
  }

  const inputValue = (value: ValidationValue | undefined): InputValue => {
    if (Array.isArray(value)) {
      return value.join(", ")
    }
    return value
  }

  const updateRuleValue = (
    rule: ValidationEditorRule,
    event: CustomEvent<InputValue>
  ): void => {
    rule.value = event.detail
  }

  const exists = (value: unknown): boolean => {
    return value != null && value !== ""
  }

  const addRule = (): void => {
    const id = generate()
    rules = [
      ...(rules || []),
      {
        valueType: "Binding",
        type: fieldType,
        id,
        value: fieldType == "array" ? [] : null,
      },
    ]
    expandedRules.add(id)
    expandedRules = expandedRules
  }

  const removeRule = (id: string): void => {
    rules = rules.filter(link => link.id !== id)
    expandedRules.delete(id)
    expandedRules = expandedRules
  }

  const duplicateRule = (id: string): void => {
    const existingRule = rules.find(rule => rule.id === id)
    if (!existingRule) {
      return
    }
    const newRule = { ...existingRule, id: generate() }
    rules = [...rules, newRule]
    expandedRules.add(newRule.id)
    expandedRules = expandedRules
  }

  const supportsConstraintValue = (constraint?: string): boolean => {
    return constraint !== "required"
  }

  const toggleRule = (id: string): void => {
    if (expandedRules.has(id)) {
      expandedRules.delete(id)
    } else {
      expandedRules.add(id)
    }
    expandedRules = expandedRules
  }

  const constraintLabel = (constraint?: string): string => {
    const option = constraintOptions.find(option => option.value === constraint)
    return option?.label || "Choose a constraint"
  }

  const valueSummary = (rule: ValidationEditorRule): string => {
    if (!supportsConstraintValue(rule.constraint)) {
      return ""
    }
    if (rule.value == null || rule.value === "") {
      return ""
    }
    if (Array.isArray(rule.value)) {
      return rule.value.length ? rule.value.join(", ") : ""
    }
    if (isJSBinding(rule.value)) {
      return "(JavaScript function)"
    }
    return String(rule.value)
  }
</script>

<DrawerContent>
  <div class="container">
    <Layout noPadding gap="L">
      <Layout noPadding gap={schemaRules?.length ? "S" : "XS"}>
        <Heading size="XS">Schema validation rules</Heading>
        {#if schemaRules?.length}
          <Body size="S">
            These rules come from the table schema and cannot be edited here.
            Update the table schema to change them, or add custom rules below.
          </Body>
        {/if}
        <SchemaRulesSummary rules={schemaRules} {constraintOptions} />
      </Layout>
      <Layout noPadding gap="S">
        <div class="section-header">
          <Heading size="XS">Custom validation rules</Heading>
          <Button secondary icon="plus" on:click={addRule}>Add rule</Button>
        </div>
        {#if rules?.length}
          <div class="rules">
            {#each rules as rule (rule.id)}
              {@const valueDisabled = !supportsConstraintValue(rule.constraint)}
              {@const isExpanded = expandedRules.has(rule.id)}
              <ValidationRuleCard
                title={constraintLabel(rule.constraint)}
                summary={valueSummary(rule)}
                error={rule.error}
                expanded={isExpanded}
                on:toggle={() => toggleRule(rule.id)}
              >
                <svelte:fragment slot="actions">
                  <button
                    type="button"
                    class="icon-button"
                    aria-label="Duplicate rule"
                    on:click={() => duplicateRule(rule.id)}
                  >
                    <Icon name="copy" hoverable size="S" />
                  </button>
                  <button
                    type="button"
                    class="icon-button"
                    aria-label="Remove rule"
                    on:click={() => removeRule(rule.id)}
                  >
                    <Icon name="x" hoverable size="S" />
                  </button>
                </svelte:fragment>

                <div class="rule-row" class:rule-row--no-value={valueDisabled}>
                  <Select
                    label="Constraint"
                    bind:value={rule.constraint}
                    options={constraintOptions}
                    placeholder="Constraint"
                  />
                  {#if !valueDisabled}
                    <Select
                      label="Value type"
                      placeholder={false}
                      bind:value={rule.valueType}
                      options={["Binding", "Value"]}
                    />

                    {#if rule.valueType === "Binding"}
                      <DrawerBindableInput
                        label="Value"
                        title="Value"
                        placeholder="Constraint value"
                        value={rule.value}
                        {bindings}
                        on:change={e => (rule.value = e.detail)}
                      />
                    {:else if rule.type !== "array" && rule.constraint && stringConstraints.includes(rule.constraint)}
                      <Input
                        label="Value"
                        value={inputValue(rule.value)}
                        on:change={e => updateRuleValue(rule, e)}
                        placeholder="Constraint value"
                      />
                    {:else if rule.type && ["string", "number", "options", "longform"].includes(rule.type)}
                      <Input
                        label="Value"
                        value={inputValue(rule.value)}
                        on:change={e => updateRuleValue(rule, e)}
                        placeholder="Constraint value"
                      />
                    {:else if rule.type === "array"}
                      <Select
                        label="Value"
                        options={dataSourceSchema?.schema?.[field]?.constraints
                          ?.inclusion || []}
                        getOptionLabel={x => x}
                        getOptionValue={x => x}
                        value={rule.value}
                        on:change={e => {
                          rule.value = e.detail
                        }}
                      />
                    {:else if rule.type === "boolean"}
                      <Select
                        label="Value"
                        options={[
                          { label: "True", value: "true" },
                          { label: "False", value: "false" },
                        ]}
                        bind:value={rule.value}
                      />
                    {:else if rule.type === "datetime"}
                      <Layout noPadding gap="XS">
                        <Label>Value</Label>
                        <DatePicker
                          enableTime={false}
                          bind:value={rule.value}
                        />
                      </Layout>
                    {:else}
                      <Layout noPadding gap="XS">
                        <Label>Value</Label>
                        <DrawerBindableInput disabled />
                      </Layout>
                    {/if}
                  {/if}
                  <DrawerBindableInput
                    label="Error message"
                    title="Error message"
                    placeholder={defaultErrorForConstraint(
                      rule.constraint,
                      rule.value
                    )}
                    value={rule.error}
                    {bindings}
                    on:change={e => (rule.error = e.detail)}
                  />
                </div>
              </ValidationRuleCard>
            {/each}
          </div>
        {:else}
          <Body size="S">There are no custom validation rules.</Body>
        {/if}
      </Layout>
    </Layout>
  </div>
</DrawerContent>

<style>
  .container {
    width: 100%;
    max-width: 1120px;
    margin: 0 auto;
  }
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
  }
  .rules {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-m);
  }
  .rule-row {
    display: grid;
    grid-template-columns:
      minmax(170px, 210px) minmax(130px, 160px) minmax(180px, 1fr)
      minmax(220px, 1.3fr);
    gap: var(--spacing-m);
    align-items: center;
  }
  .rule-row--no-value {
    grid-template-columns: minmax(170px, 210px) minmax(220px, 1.3fr);
  }
  .icon-button {
    display: flex;
    padding: 0;
    border: none;
    background: none;
    color: inherit;
    cursor: pointer;
  }

  @media (max-width: 1100px) {
    .rule-row {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      align-items: start;
    }
  }

  @media (max-width: 900px) {
    .section-header {
      align-items: flex-start;
      flex-direction: column;
    }
    .rule-row {
      grid-template-columns: 1fr;
      align-items: stretch;
      padding: var(--spacing-m);
      border: 1px solid var(--spectrum-global-color-gray-200);
      border-radius: var(--border-radius-s);
      background: var(--spectrum-global-color-gray-75);
    }
  }
</style>

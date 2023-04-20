<script>
  import { _ } from "../../../../../../lang/i18n"
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

  export let rules = []
  export let bindings = []
  export let type

  const Constraints = {
    Required: {
      label: $_(
        "components.design.settings.controls.ValidationEditor.ValidationDrawer.Required"
      ),
      value: "required",
    },
    MinLength: {
      label: $_(
        "components.design.settings.controls.ValidationEditor.ValidationDrawer.Min_length"
      ),
      value: "minLength",
    },
    MaxLength: {
      label: $_(
        "components.design.settings.controls.ValidationEditor.ValidationDrawer.Max_length"
      ),
      value: "maxLength",
    },
    MaxValue: {
      label: $_(
        "components.design.settings.controls.ValidationEditor.ValidationDrawer.Max_value"
      ),
      value: "maxValue",
    },
    MinValue: {
      label: $_(
        "components.design.settings.controls.ValidationEditor.ValidationDrawer.Min_value"
      ),
      value: "minValue",
    },
    Equal: {
      label: $_(
        "components.design.settings.controls.ValidationEditor.ValidationDrawer.Must_equal"
      ),
      value: "equal",
    },
    NotEqual: {
      label: $_(
        "components.design.settings.controls.ValidationEditor.ValidationDrawer.Must_not_equal"
      ),
      value: "notEqual",
    },
    Regex: {
      label: $_(
        "components.design.settings.controls.ValidationEditor.ValidationDrawer.Must_match_regex"
      ),
      value: "regex",
    },
    NotRegex: {
      label: $_(
        "components.design.settings.controls.ValidationEditor.ValidationDrawer.Must_not_match_regex"
      ),
      value: "notRegex",
    },
    Contains: {
      label: $_(
        "components.design.settings.controls.ValidationEditor.ValidationDrawer.Must_contain"
      ),
      value: "contains",
    },
    NotContains: {
      label: $_(
        "components.design.settings.controls.ValidationEditor.ValidationDrawer.Must_not_contain"
      ),
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
    ["array"]: [
      Constraints.Required,
      Constraints.MinLength,
      Constraints.MaxLength,
      Constraints.Contains,
      Constraints.NotContains,
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
        error: $_(
          "components.design.settings.controls.ValidationEditor.ValidationDrawer.Required_field"
        ),
      })
    }

    // String length constraint
    if (exists(constraints.length?.maximum)) {
      const length = constraints.length.maximum
      rules.push({
        constraint: "maxLength",
        value: length,
        error: `${$_(
          "components.design.settings.controls.ValidationEditor.ValidationDrawer.Maximum"
        )} ${length} ${$_(
          "components.design.settings.controls.ValidationEditor.ValidationDrawer.characters"
        )}`,
      })
    }

    // Min / max number constraint
    if (exists(constraints.numericality?.greaterThanOrEqualTo)) {
      const min = constraints.numericality.greaterThanOrEqualTo
      rules.push({
        constraint: "minValue",
        value: min,
        error: `${$_(
          "components.design.settings.controls.ValidationEditor.ValidationDrawer.Minimun_value"
        )} ${min}`,
      })
    }
    if (exists(constraints.numericality?.lessThanOrEqualTo)) {
      const max = constraints.numericality.lessThanOrEqualTo
      rules.push({
        constraint: "maxValue",
        value: max,
        error: `${$_(
          "components.design.settings.controls.ValidationEditor.ValidationDrawer.Maximum_value"
        )} ${max}`,
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
        <Heading size="XS"
          >{$_(
            "components.design.settings.controls.ValidationEditor.ValidationDrawer.Schema_validation"
          )}</Heading
        >
        {#if schemaRules?.length}
          <div class="links">
            {#each schemaRules as rule}
              <div class="rule schema">
                <Select
                  placeholder={$_(
                    "components.design.settings.controls.ValidationEditor.ValidationDrawer.Constraint"
                  )}
                  value={rule.constraint}
                  options={constraintOptions}
                  disabled
                />
                <Select
                  placeholder={null}
                  value="Value"
                  options={[
                    $_(
                      "components.design.settings.controls.ValidationEditor.ValidationDrawer.Binding"
                    ),
                    $_(
                      "components.design.settings.controls.ValidationEditor.ValidationDrawer.Value"
                    ),
                  ]}
                  disabled
                />
                <DrawerBindableInput
                  placeholder={$_(
                    "components.design.settings.controls.ValidationEditor.ValidationDrawer.Constraint_value"
                  )}
                  value={rule.value}
                  {bindings}
                  disabled
                />
                <DrawerBindableInput
                  placeholder={$_(
                    "components.design.settings.controls.ValidationEditor.ValidationDrawer.Error_message"
                  )}
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
            {$_(
              "components.design.settings.controls.ValidationEditor.ValidationDrawer.no_rules"
            )}
          </Body>
        {/if}
      </Layout>
      <Layout noPadding gap="S">
        <Heading size="XS"
          >{$_(
            "components.design.settings.controls.ValidationEditor.ValidationDrawer.Custom_rules"
          )}</Heading
        >
        {#if rules?.length}
          <div class="links">
            {#each rules as rule (rule.id)}
              <div class="rule">
                <Select
                  bind:value={rule.constraint}
                  options={constraintOptions}
                  placeholder={$_(
                    "components.design.settings.controls.ValidationEditor.ValidationDrawer.Constraint"
                  )}
                />
                <Select
                  disabled={rule.constraint === "required"}
                  placeholder={null}
                  bind:value={rule.valueType}
                  options={[
                    $_(
                      "components.design.settings.controls.ValidationEditor.ValidationDrawer.Binding"
                    ),
                    $_(
                      "components.design.settings.controls.ValidationEditor.ValidationDrawer.Value"
                    ),
                  ]}
                />

                {#if rule.valueType === "Binding"}
                  <!-- Bindings always get a bindable input -->
                  <DrawerBindableInput
                    placeholder={$_(
                      "components.design.settings.controls.ValidationEditor.ValidationDrawer.Constraint_value"
                    )}
                    value={rule.value}
                    {bindings}
                    disabled={rule.constraint === "required"}
                    on:change={e => (rule.value = e.detail)}
                  />
                {:else if rule.type !== "array" && ["maxLength", "minLength", "regex", "notRegex", "contains", "notContains"].includes(rule.constraint)}
                  <!-- Certain constraints always need string values-->
                  <Input
                    bind:value={rule.value}
                    placeholder={$_(
                      "components.design.settings.controls.ValidationEditor.ValidationDrawer.Constraint_value"
                    )}
                  />
                {:else}
                  <!-- Otherwise we render a component based on the type -->
                  {#if ["string", "number", "options", "longform"].includes(rule.type)}
                    <Input
                      disabled={rule.constraint === "required"}
                      bind:value={rule.value}
                      placeholder={$_(
                        "components.design.settings.controls.ValidationEditor.ValidationDrawer.Constraint_value"
                      )}
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
                        {
                          label: $_(
                            "components.design.settings.controls.ValidationEditor.ValidationDrawer.True"
                          ),
                          value: "true",
                        },
                        {
                          label: $_(
                            "components.design.settings.controls.ValidationEditor.ValidationDrawer.False"
                          ),
                          value: "false",
                        },
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
                  placeholder={$_(
                    "components.design.settings.controls.ValidationEditor.ValidationDrawer.Error_message"
                  )}
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
            >{$_(
              "components.design.settings.controls.ValidationEditor.ValidationDrawer.Add_Rule"
            )}</Button
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

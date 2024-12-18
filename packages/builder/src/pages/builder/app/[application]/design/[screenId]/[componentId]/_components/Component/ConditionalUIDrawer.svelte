<script>
  import {
    Button,
    Body,
    Icon,
    DrawerContent,
    Layout,
    Select,
    DatePicker,
  } from "@budibase/bbui"
  import { flip } from "svelte/animate"
  import { dndzone } from "svelte-dnd-action"
  import { generate } from "shortid"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"
  import { QueryUtils, Constants } from "@budibase/frontend-core"
  import { selectedComponent, componentStore } from "@/stores/builder"
  import { getComponentForSetting } from "@/components/design/settings/componentSettings"
  import PropertyControl from "@/components/design/settings/controls/PropertyControl.svelte"

  export let conditions = []
  export let bindings = []

  const flipDurationMs = 150
  const actionOptions = [
    {
      label: "Hide component",
      value: "hide",
    },
    {
      label: "Show component",
      value: "show",
    },
    {
      label: "Update setting",
      value: "update",
    },
  ]
  const valueTypeOptions = [
    {
      value: "string",
      label: "Binding",
    },
    {
      value: "number",
      label: "Number",
    },
    {
      value: "datetime",
      label: "Date",
    },
    {
      value: "boolean",
      label: "Boolean",
    },
  ]

  let dragDisabled = true
  $: settings = componentStore
    .getComponentSettings($selectedComponent?._component)
    ?.concat({
      label: "Custom CSS",
      key: "_css",
      type: "text",
    })
  $: settingOptions = settings
    .filter(setting => setting.supportsConditions !== false)
    .map(setting => ({
      label: makeLabel(setting),
      value: setting.key,
    }))
  $: conditions.forEach(link => {
    if (!link.id) {
      link.id = generate()
    }
  })

  const makeLabel = setting => {
    const { section, label } = setting
    if (section) {
      return label ? `${section} - ${label}` : section
    } else {
      return label
    }
  }

  const getSettingDefinition = key => {
    return settings.find(setting => setting.key === key)
  }

  const addCondition = () => {
    conditions = [
      ...conditions,
      {
        valueType: "string",
        id: generate(),
        action: "hide",
        operator: Constants.OperatorOptions.Equals.value,
      },
    ]
  }

  const removeCondition = id => {
    conditions = conditions.filter(link => link.id !== id)
  }

  const duplicateCondition = id => {
    const condition = conditions.find(link => link.id === id)
    const duplicate = { ...condition, id: generate() }
    conditions = [...conditions, duplicate]
  }

  const handleFinalize = e => {
    updateConditions(e)
    dragDisabled = true
  }

  const updateConditions = e => {
    conditions = e.detail.items
  }

  const getOperatorOptions = condition => {
    return QueryUtils.getValidOperatorsForType({ type: condition.valueType })
  }

  const onOperatorChange = (condition, newOperator) => {
    const noValueOptions = [
      Constants.OperatorOptions.Empty.value,
      Constants.OperatorOptions.NotEmpty.value,
    ]
    condition.noValue = noValueOptions.includes(newOperator)
    if (condition.noValue || newOperator === "oneOf") {
      condition.referenceValue = null
      condition.valueType = "string"
    }
  }

  const onValueTypeChange = (condition, newType) => {
    condition.referenceValue = null

    // Ensure a valid operator is set
    const validOperators = QueryUtils.getValidOperatorsForType({
      type: newType,
    }).map(x => x.value)
    if (!validOperators.includes(condition.operator)) {
      condition.operator =
        validOperators[0] ?? Constants.OperatorOptions.Equals.value
      onOperatorChange(condition, condition.operator)
    }
  }

  const onSettingChange = (e, condition) => {
    const setting = settings.find(x => x.key === e.detail)
    if (setting?.defaultValue != null) {
      condition.settingValue = setting.defaultValue
    } else {
      delete condition.settingValue
    }
  }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<DrawerContent>
  <div class="container">
    <Layout noPadding>
      {#if conditions?.length}
        <div
          class="conditions"
          use:dndzone={{
            items: conditions,
            flipDurationMs,
            dropTargetStyle: { outline: "none" },
            dragDisabled,
          }}
          on:finalize={handleFinalize}
          on:consider={updateConditions}
        >
          {#each conditions as condition (condition.id)}
            {@const definition = getSettingDefinition(condition.setting)}
            <div
              class="condition"
              class:update={condition.action === "update"}
              animate:flip={{ duration: flipDurationMs }}
            >
              <div
                class="handle"
                aria-label="drag-handle"
                style={dragDisabled ? "cursor: grab" : "cursor: grabbing"}
                on:mousedown={() => (dragDisabled = false)}
              >
                <Icon name="DragHandle" size="XL" />
              </div>
              <Select
                placeholder={null}
                options={actionOptions}
                bind:value={condition.action}
              />
              {#if condition.action === "update"}
                <Select
                  options={settingOptions}
                  bind:value={condition.setting}
                  on:change={e => onSettingChange(e, condition)}
                />
                <div>TO</div>
                {#if definition}
                  <PropertyControl
                    type={definition.type}
                    control={getComponentForSetting(definition)}
                    key={definition.key}
                    value={condition.settingValue}
                    componentInstance={$selectedComponent}
                    onChange={val => (condition.settingValue = val)}
                    props={{
                      options: definition.options,
                      placeholder: definition.placeholder,
                    }}
                    {bindings}
                  />
                {:else}
                  <Select disabled placeholder=" " />
                {/if}
              {/if}
              <div>IF</div>
              <DrawerBindableInput
                {bindings}
                placeholder="Value"
                value={condition.newValue}
                on:change={e => (condition.newValue = e.detail)}
              />
              <Select
                placeholder={null}
                options={getOperatorOptions(condition)}
                bind:value={condition.operator}
                on:change={e => onOperatorChange(condition, e.detail)}
              />
              <Select
                disabled={condition.noValue || condition.operator === "oneOf"}
                options={valueTypeOptions}
                bind:value={condition.valueType}
                placeholder={null}
                on:change={e => onValueTypeChange(condition, e.detail)}
              />
              {#if ["string", "number"].includes(condition.valueType)}
                <DrawerBindableInput
                  disabled={condition.noValue}
                  {bindings}
                  placeholder="Value"
                  value={condition.referenceValue}
                  on:change={e => (condition.referenceValue = e.detail)}
                />
              {:else if condition.valueType === "datetime"}
                <DatePicker
                  placeholder="Value"
                  disabled={condition.noValue}
                  bind:value={condition.referenceValue}
                />
              {:else if condition.valueType === "boolean"}
                <Select
                  placeholder="Value"
                  disabled={condition.noValue}
                  options={["True", "False"]}
                  bind:value={condition.referenceValue}
                />
              {/if}
              <Icon
                name="Duplicate"
                hoverable
                size="S"
                on:click={() => duplicateCondition(condition.id)}
              />
              <Icon
                name="Close"
                hoverable
                size="S"
                on:click={() => removeCondition(condition.id)}
              />
            </div>
          {/each}
        </div>
      {:else}
        <Body size="S">Add your first condition to get started.</Body>
      {/if}
      <div>
        <Button secondary icon="Add" on:click={addCondition}>
          Add condition
        </Button>
      </div>
    </Layout>
  </div>
</DrawerContent>

<style>
  .container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
  }
  .conditions {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: var(--spacing-m);
  }
  .condition {
    gap: var(--spacing-l);
    display: grid;
    align-items: center;
    grid-template-columns:
      auto 150px auto minmax(140px, 1fr) 120px 100px minmax(140px, 1fr)
      auto auto;
    border-radius: var(--border-radius-s);
    transition: background-color ease-in-out 130ms;
  }
  .condition.update {
    grid-template-columns:
      auto 150px minmax(140px, 1fr) auto minmax(140px, 1fr) auto
      minmax(140px, 1fr) 120px 100px minmax(140px, 1fr) auto auto;
  }
  .condition:hover {
    background-color: var(--spectrum-global-color-gray-100);
  }
  .handle {
    display: grid;
    place-items: center;
  }
</style>

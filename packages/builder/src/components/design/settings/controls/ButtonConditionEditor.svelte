<script lang="ts">
  import {
    ActionButton,
    Drawer,
    Button,
    Body,
    DrawerContent,
    Layout,
    Select,
    Icon,
    DatePicker,
  } from "@budibase/bbui"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"
  import { QueryUtils, Constants } from "@budibase/frontend-core"
  import { generate } from "shortid"
  import { dndzone } from "svelte-dnd-action"
  import { flip } from "svelte/animate"
  import PropertyControl from "@/components/design/settings/controls/PropertyControl.svelte"
  import { componentStore } from "@/stores/builder"
  import { getComponentForSetting } from "@/components/design/settings/componentSettings"
  import { cloneDeep } from "lodash"
  import { createEventDispatcher } from "svelte"
  import { BasicOperator, FieldType } from "@budibase/types"
  import type {
    ArrayOperator,
    ComponentCondition,
    ComponentSetting,
    EnrichedBinding,
  } from "@budibase/types"

  interface ExtendedComponentSetting extends ComponentSetting {
    options?: any[]
    placeholder?: string
  }

  export let componentInstance
  export let value
  export let conditions: ComponentCondition[] = []
  export let bindings: EnrichedBinding[] = []
  export let componentBindings: EnrichedBinding[] = []

  let drawer: Drawer
  const dispatch = createEventDispatcher()
  const flipDurationMs = 150
  const zoneType = generate()
  const actionOptions = [
    {
      label: "Hide component",
      value: "hide",
    },
    {
      label: "Show component",
      value: "show",
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

  $: count = value?.length
  $: conditionText = `${count || "No"} condition${count !== 1 ? "s" : ""} set`

  $: settings = componentStore
    .getComponentSettings(componentInstance?._component)
    ?.concat({
      label: "Custom CSS",
      key: "_css",
      type: "text",
    })
  $: settingOptions = settings.map(setting => ({
    label: makeLabel(setting),
    value: setting.key,
  }))

  const makeLabel = (setting: ComponentSetting) => {
    const { section, label } = setting
    if (section) {
      return label ? `${section} - ${label}` : section
    } else {
      return label
    }
  }

  const getSettingDefinition = (
    key: string | undefined
  ): ExtendedComponentSetting | undefined => {
    return settings.find(setting => setting.key === key) as
      | ExtendedComponentSetting
      | undefined
  }

  const addCondition = () => {
    conditions = [
      ...conditions,
      {
        id: generate(),
        action: "hide",
        operator: BasicOperator.EQUAL,
        valueType: "string",
        type: FieldType.STRING,
      },
    ]
  }

  const removeCondition = (id: string) => {
    conditions = conditions.filter(link => link.id !== id)
  }

  const duplicateCondition = (id: string) => {
    const condition: ComponentCondition = conditions.find(
      link => link.id === id
    )!
    const duplicate = { ...condition, id: generate() }
    conditions = [...conditions, duplicate]
  }

  const handleFinalize = (e: CustomEvent) => {
    updateConditions(e)
    dragDisabled = true
  }

  const updateConditions = (e: CustomEvent) => {
    conditions = e.detail.items
  }

  const getOperatorOptions = (condition: ComponentCondition) => {
    return QueryUtils.getValidOperatorsForType({
      type: condition.type as FieldType,
    })
  }

  const onOperatorChange = (
    condition: ComponentCondition,
    newOperator: ArrayOperator | BasicOperator
  ) => {
    const noValueOptions = [
      Constants.OperatorOptions.Empty.value,
      Constants.OperatorOptions.NotEmpty.value,
    ]
    condition.noValue = noValueOptions.includes(newOperator)
    if (condition.noValue || newOperator === "oneOf") {
      condition.referenceValue = null
      condition.type = FieldType.STRING
    }
  }

  const onValueTypeChange = (
    condition: ComponentCondition,
    newType: FieldType
  ) => {
    condition.referenceValue = null

    // Ensure a valid operator is set
    const validOperators = QueryUtils.getValidOperatorsForType({
      type: newType,
    }).map(x => x.value)
    if (!validOperators.includes(condition.operator)) {
      condition.operator =
        (validOperators[0] as ArrayOperator | BasicOperator) ??
        BasicOperator.EQUAL
      onOperatorChange(condition, condition.operator)
    }
  }

  const onSettingChange = (e: CustomEvent, condition: ComponentCondition) => {
    const setting = settings.find(x => x.key === e.detail)
    if (setting?.defaultValue != null) {
      condition.settingValue = setting.defaultValue
    } else {
      delete condition.settingValue
    }
  }

  const onSettingValueChange = (
    val: unknown,
    condition: ComponentCondition
  ) => {
    condition.settingValue = val
  }

  const propertyControlChangeHandler = (condition: ComponentCondition) => {
    return (val: unknown) => onSettingValueChange(val, condition)
  }

  const openDrawer = () => {
    conditions = cloneDeep(value || [])
    drawer.show()
  }
  const save = async () => {
    dispatch("change", conditions)
    drawer.hide()
  }
</script>

<ActionButton on:click={openDrawer}>{conditionText}</ActionButton>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<Drawer
  bind:this={drawer}
  title="{componentInstance.text} conditions"
  on:drawerShow
  on:drawerHide
>
  <Button cta slot="buttons" on:click={save}>Save</Button>
  <DrawerContent slot="body">
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
              type: zoneType,
              dropFromOthersDisabled: true,
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
                  <Icon
                    name="dots-six-vertical"
                    size="L"
                    color="var(--spectrum-global-color-gray-600)"
                    hoverable={true}
                    hoverColor="var(--spectrum-global-color-gray-800)"
                  />
                </div>
                <Select
                  placeholder={false}
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
                      {componentInstance}
                      onChange={propertyControlChangeHandler(condition)}
                      props={{
                        options: definition.options,
                        placeholder: definition.placeholder,
                      }}
                      nested={definition.nested}
                      contextAccess={definition.contextAccess}
                      {bindings}
                      {componentBindings}
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
                  placeholder={false}
                  options={getOperatorOptions(condition)}
                  bind:value={condition.operator}
                  on:change={e => onOperatorChange(condition, e.detail)}
                />
                <Select
                  disabled={condition.noValue || condition.operator === "oneOf"}
                  options={valueTypeOptions}
                  bind:value={condition.type}
                  placeholder={false}
                  on:change={e => onValueTypeChange(condition, e.detail)}
                />
                {#if ["string", "number"].includes(condition.type)}
                  <DrawerBindableInput
                    disabled={condition.noValue}
                    {bindings}
                    placeholder="Value"
                    value={condition.referenceValue}
                    on:change={e => (condition.referenceValue = e.detail)}
                  />
                {:else if condition.type === "datetime"}
                  <DatePicker
                    placeholder="Value"
                    disabled={condition.noValue}
                    bind:value={condition.referenceValue}
                  />
                {:else if condition.type === "boolean"}
                  <Select
                    placeholder="Value"
                    disabled={condition.noValue}
                    options={["True", "False"]}
                    bind:value={condition.referenceValue}
                  />
                {/if}
                <Icon
                  name="copy"
                  hoverable
                  size="S"
                  on:click={() => duplicateCondition(condition.id)}
                />
                <Icon
                  name="x"
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
          <Button secondary icon="plus" on:click={addCondition}>
            Add condition
          </Button>
        </div>
      </Layout>
    </div>
  </DrawerContent>
</Drawer>

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

<script>
  import {
    ActionButton,
    Drawer,
    Button,
    DrawerContent,
    Layout,
    Select,
    Icon,
    DatePicker,
    Combobox,
    Multiselect,
  } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { cloneDeep } from "lodash"
  import ColorPicker from "./ColorPicker.svelte"
  import DrawerBindableInput from "@/components/common/bindings/DrawerBindableInput.svelte"
  import { QueryUtils, Constants, FilterUsers } from "@budibase/frontend-core"
  import { generate } from "shortid"
  import { FieldType, FormulaType } from "@budibase/types"
  import { dndzone } from "svelte-dnd-action"
  import { flip } from "svelte/animate"

  export let componentInstance
  export let bindings
  export let value

  const dispatch = createEventDispatcher()
  const flipDuration = 130
  const targetOptions = [
    {
      label: "Cell",
      value: "cell",
    },
    {
      label: "Row",
      value: "row",
    },
  ]
  const conditionOptions = [
    {
      label: "Background color",
      value: "backgroundColor",
    },
    {
      label: "Text color",
      value: "textColor",
    },
  ]

  let tempValue = []
  let drawer
  let dragDisabled = true

  $: count = value?.length
  $: conditionText = `${count || "No"} condition${count !== 1 ? "s" : ""} set`
  $: type = componentInstance.columnType
  $: valueTypeOptions = getValueTypeOptions(type)
  $: hasValueOption = type !== FieldType.STRING
  $: operatorOptions = QueryUtils.getValidOperatorsForType({
    type,

    // We can filter on any formula columns here since we already have the data
    // on the page, so adding this ensures formula columns get operators
    formulaType: FormulaType.STATIC,
  })

  const getValueTypeOptions = type => {
    let options = [
      {
        label: "Binding",
        value: FieldType.STRING,
      },
    ]
    if (type !== FieldType.STRING) {
      options.push({
        label: "Value",
        value: type,
      })
    }
    return options
  }

  const openDrawer = () => {
    tempValue = cloneDeep(value || [])
    drawer.show()
  }

  const save = async () => {
    dispatch("change", tempValue)
    drawer.hide()
  }

  const addCondition = () => {
    const condition = {
      id: generate(),
      target: targetOptions[0].value,
      metadataKey: conditionOptions[0].value,
      operator: operatorOptions[0]?.value,
      valueType: FieldType.STRING,
    }
    tempValue = [...tempValue, condition]
  }

  const duplicateCondition = condition => {
    const dupe = { ...condition, id: generate() }
    tempValue = [...tempValue, dupe]
  }

  const removeCondition = condition => {
    tempValue = tempValue.filter(c => c.id !== condition.id)
  }

  const onOperatorChange = (condition, newOperator) => {
    const noValueOptions = [
      Constants.OperatorOptions.Empty.value,
      Constants.OperatorOptions.NotEmpty.value,
    ]
    condition.noValue = noValueOptions.includes(newOperator)
    if (condition.noValue) {
      condition.referenceValue = null
      condition.valueType = "string"
    }
  }

  const onValueTypeChange = condition => {
    condition.referenceValue = null
  }

  const updateConditions = e => {
    tempValue = e.detail.items
  }

  const handleFinalize = e => {
    updateConditions(e)
    dragDisabled = true
  }
</script>

<ActionButton on:click={openDrawer}>{conditionText}</ActionButton>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<Drawer
  bind:this={drawer}
  title="{componentInstance.field} conditions"
  on:drawerShow
  on:drawerHide
>
  <Button cta slot="buttons" on:click={save}>Save</Button>
  <DrawerContent slot="body">
    <div class="container">
      <Layout noPadding>
        Update the appearance of cells and rows based on their value.
        {#if tempValue.length}
          <div
            class="conditions"
            use:dndzone={{
              items: tempValue,
              flipDurationMs: flipDuration,
              dropTargetStyle: { outline: "none" },
              dragDisabled,
            }}
            on:consider={updateConditions}
            on:finalize={handleFinalize}
          >
            {#each tempValue as condition (condition.id)}
              <div
                class="condition"
                class:update={condition.action === "update"}
                class:with-value-option={hasValueOption}
                animate:flip={{ duration: flipDuration }}
              >
                <div
                  class="handle"
                  aria-label="drag-handle"
                  style={dragDisabled ? "cursor: grab" : "cursor: grabbing"}
                  on:mousedown={() => (dragDisabled = false)}
                >
                  <Icon name="DragHandle" size="XL" />
                </div>
                <span>Update</span>
                <Select
                  placeholder={null}
                  options={targetOptions}
                  bind:value={condition.target}
                />
                <Select
                  placeholder={null}
                  options={conditionOptions}
                  bind:value={condition.metadataKey}
                />
                <span>to</span>
                <ColorPicker
                  value={condition.metadataValue}
                  on:change={e => (condition.metadataValue = e.detail)}
                />
                <span>if value</span>
                <Select
                  placeholder={null}
                  options={operatorOptions}
                  bind:value={condition.operator}
                  on:change={e => onOperatorChange(condition, e.detail)}
                />
                {#if hasValueOption}
                  <Select
                    disabled={condition.noValue}
                    options={valueTypeOptions}
                    bind:value={condition.valueType}
                    placeholder={null}
                    on:change={() => onValueTypeChange(condition)}
                  />
                {/if}
                {#if type === FieldType.DATETIME && condition.valueType === type}
                  <DatePicker
                    placeholder="Value"
                    disabled={condition.noValue}
                    bind:value={condition.referenceValue}
                  />
                {:else if type === FieldType.BOOLEAN && condition.valueType === type}
                  <Select
                    placeholder="Value"
                    disabled={condition.noValue}
                    options={["True", "False"]}
                    bind:value={condition.referenceValue}
                  />
                {:else if (type === FieldType.OPTIONS || type === FieldType.ARRAY) && condition.valueType === type}
                  {#if condition.operator === Constants.OperatorOptions.In.value}
                    <Multiselect
                      disabled={condition.noValue}
                      options={componentInstance.schema?.[
                        componentInstance.field
                      ]?.constraints?.inclusion || []}
                      bind:value={condition.referenceValue}
                    />
                  {:else}
                    <Combobox
                      disabled={condition.noValue}
                      options={componentInstance.schema?.[
                        componentInstance.field
                      ]?.constraints?.inclusion || []}
                      bind:value={condition.referenceValue}
                    />
                  {/if}
                {:else if (type === FieldType.BB_REFERENCE || type === FieldType.BB_REFERENCE_SINGLE) && condition.valueType === type}
                  <FilterUsers
                    value={condition.referenceValue}
                    multiselect={[
                      Constants.OperatorOptions.In.value,
                      Constants.OperatorOptions.ContainsAny.value,
                    ].includes(condition.operator)}
                    on:change={e => {
                      condition.referenceValue = e.detail
                    }}
                    disabled={condition.noValue}
                    type={condition.valueType}
                  />
                {:else}
                  <DrawerBindableInput
                    {bindings}
                    placeholder="Value"
                    disabled={condition.noValue}
                    value={condition.referenceValue}
                    on:change={e => (condition.referenceValue = e.detail)}
                  />
                {/if}
                <Icon
                  name="Duplicate"
                  hoverable
                  size="S"
                  on:click={() => duplicateCondition(condition)}
                />
                <Icon
                  name="Close"
                  hoverable
                  size="S"
                  on:click={() => removeCondition(condition)}
                />
              </div>
            {/each}
          </div>
        {/if}
        <div>
          <Button secondary icon="Add" on:click={addCondition}>
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
    max-width: 1200px;
    margin: 0 auto;
  }
  .conditions {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }
  .condition {
    display: grid;
    grid-template-columns: auto auto 1fr 1fr auto auto auto 1fr 1fr auto auto;
    align-items: center;
    grid-column-gap: var(--spacing-l);
  }
  .condition.with-value-option {
    grid-template-columns: auto auto 1fr 1fr auto auto auto 1fr 1fr 1fr auto auto;
  }
</style>

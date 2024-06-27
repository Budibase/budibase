<script>
  import {
    ActionButton,
    Drawer,
    Button,
    DrawerContent,
    Layout,
    Select,
    Icon,
  } from "@budibase/bbui"
  import { createEventDispatcher } from "svelte"
  import { cloneDeep } from "lodash"
  import ColorPicker from "./ColorPicker.svelte"
  import DrawerBindableInput from "components/common/bindings/DrawerBindableInput.svelte"
  import { QueryUtils, Constants } from "@budibase/frontend-core"
  import { generate } from "shortid"
  import { FieldType } from "@budibase/types"
  import { dndzone } from "svelte-dnd-action"
  import { flip } from "svelte/animate"

  export let componentInstance
  export let bindings
  export let value

  const dispatch = createEventDispatcher()
  const flipDuration = 130

  let tempValue = []
  let drawer
  let dragDisabled = true

  $: conditionCount = value?.length
  $: conditionText = `${conditionCount || "No"} condition${
    conditionCount !== 1 ? "s" : ""
  } set`
  $: type = componentInstance.columnType
  $: valueTypeOptions = [
    {
      label: "Binding",
      value: FieldType.STRING,
    },
    {
      label: "Value",
      value: type,
    },
  ]
  $: operatorOptions = QueryUtils.getValidOperatorsForType({ type })

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
      operator: Constants.OperatorOptions.Equals.value,
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
    if (condition.noValue || newOperator === "oneOf") {
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
<Drawer bind:this={drawer} title="Conditions" on:drawerShow on:drawerHide>
  <Button cta slot="buttons" on:click={save}>Save</Button>
  <DrawerContent slot="body">
    <div class="container">
      <Layout noPadding>
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
                <span>Set background color to</span>
                <ColorPicker
                  value={condition.color}
                  on:change={e => (condition.color = e.detail)}
                />
                <span>if value</span>
                <Select
                  placeholder={null}
                  options={operatorOptions}
                  bind:value={condition.operator}
                  on:change={e => onOperatorChange(condition, e.detail)}
                />
                <Select
                  disabled={condition.noValue || condition.operator === "oneOf"}
                  options={valueTypeOptions}
                  bind:value={condition.valueType}
                  placeholder={null}
                  on:change={() => onValueTypeChange(condition)}
                />
                <DrawerBindableInput
                  {bindings}
                  disabled={condition.noValue}
                  placeholder="Value"
                  value={condition.referenceValue}
                  on:change={e => (condition.referenceValue = e.detail)}
                />
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
    grid-template-columns: auto auto auto auto 1fr 1fr 1fr auto auto;
    align-items: center;
    grid-column-gap: var(--spacing-l);
  }
</style>

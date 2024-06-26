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

  export let componentInstance
  export let bindings
  export let value

  const dispatch = createEventDispatcher()

  let tempValue = []
  let drawer

  $: conditionCount = value?.length
  $: conditionText = `${conditionCount || "No"} condition${
    conditionCount !== 1 ? "s" : ""
  } set`
  $: valueTypeOptions = getValueTypeOptions(componentInstance.columnType)

  const openDrawer = () => {
    tempValue = cloneDeep(value || [])
    drawer.show()
  }

  const save = async () => {
    dispatch("change", tempValue)
    drawer.hide()
  }

  const getValueTypeOptions = type => {
    let options = [
      {
        label: "Binding",
        value: FieldType.STRING,
      },
    ]
    const operatorOptions = QueryUtils.getValidOperatorsForType({ type })
    if (operatorOptions.length) {
      options.push({
        label: "Value",
        value: type,
      })
    }
    return options
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
</script>

<ActionButton on:click={openDrawer}>{conditionText}</ActionButton>

<Drawer bind:this={drawer} title="Conditions" on:drawerShow on:drawerHide>
  <Button cta slot="buttons" on:click={save}>Save</Button>
  <DrawerContent slot="body">
    <div class="container">
      <Layout noPadding>
        {#if tempValue.length}
          <div class="conditions">
            {#each tempValue as condition}
              <span>Set background color to</span>
              <ColorPicker
                value={condition.color}
                on:change={e => (condition.color = e.detail)}
              />
              <span>if value</span>
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
              <DrawerBindableInput
                {bindings}
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
    display: grid;
    grid-template-columns: auto auto auto 1fr 1fr 1fr auto auto;
    align-items: center;
    grid-column-gap: var(--spacing-l);
    grid-row-gap: var(--spacing-l);
  }
</style>

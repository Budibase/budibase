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
  import { Constants } from "@budibase/frontend-core"
  import { generate } from "shortid"
  import { dndzone } from "svelte-dnd-action"
  import { flip } from "svelte/animate"
  import { getDatasourceForProvider, getSchemaForDatasource } from "dataBinding"
  import { selectedScreen, selectedComponent } from "stores/builder"
  import { makePropSafe } from "@budibase/string-templates"

  export let value

  const dispatch = createEventDispatcher()
  const flipDuration = 130
  const conditionOptions = [
    {
      label: "Update background color",
      value: "backgroundColor",
    },
    {
      label: "Update text color",
      value: "textColor",
    },
  ]

  let tempValue = []
  let drawer
  let dragDisabled = true

  $: count = value?.length
  $: conditionText = `${count || "No"} condition${count !== 1 ? "s" : ""} set`
  $: datasource = getDatasourceForProvider($selectedScreen, $selectedComponent)
  $: schema = getSchemaForDatasource($selectedScreen, datasource)?.schema
  $: rowBindings = generateRowBindings(schema)

  const generateRowBindings = schema => {
    let bindings = []
    for (let key of Object.keys(schema || {})) {
      bindings.push({
        type: "context",
        runtimeBinding: `${makePropSafe("row")}.${makePropSafe(key)}`,
        readableBinding: `Row.${key}`,
        category: "Row",
        icon: "RailTop",
        display: { name: key },
      })
    }

    return bindings
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
      metadataKey: conditionOptions[0].value,
      operator: Constants.OperatorOptions.Equals.value,
      referenceValue: true,
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
<Drawer bind:this={drawer} title="Row conditions" on:drawerShow on:drawerHide>
  <Button cta slot="buttons" on:click={save}>Save</Button>
  <DrawerContent slot="body">
    <div class="container">
      <Layout noPadding>
        Update the appearance of rows based on the entire row value.
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
                <span>if</span>
                <DrawerBindableInput
                  bindings={rowBindings}
                  allowHBS={false}
                  placeholder="Expression"
                  value={condition.value}
                  on:change={e => (condition.value = e.detail)}
                />
                <span>returns true</span>
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
    max-width: 800px;
    margin: 0 auto;
  }
  .conditions {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-l);
  }
  .condition {
    display: grid;
    grid-template-columns: auto 1fr auto auto auto 1fr auto auto auto;
    align-items: center;
    grid-column-gap: var(--spacing-l);
  }
</style>

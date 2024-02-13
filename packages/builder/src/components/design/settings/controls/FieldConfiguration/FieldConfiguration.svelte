<script>
  import { Toggle } from "@budibase/bbui"
  import {
    getBindableProperties,
    getComponentBindableProperties,
  } from "builderStore/dataBinding"
  import { store, selectedScreen } from "builderStore"
  import DraggableList from "../DraggableList/DraggableList.svelte"
  import { createEventDispatcher } from "svelte"
  import FieldSetting from "./FieldSetting.svelte"
  import { generateIncrementedName } from "helpers/helpers"

  export let componentInstance
  export let bindings
  export let value

  const dispatch = createEventDispatcher()

  $: allActive = value.every(x => x.active)
  $: customSchema = componentInstance.actionType === "Custom"
  $: resolvedBindings =
    bindings || getBindableProperties($selectedScreen, componentInstance._id)
  $: componentBindings = getComponentBindableProperties(
    $selectedScreen,
    componentInstance._id
  )

  const processItemUpdate = e => {
    const updatedField = e.detail
    const newValue = value.slice()
    const idx = newValue.findIndex(field => {
      return field._id === updatedField?._id
    })
    // Add this field if not encountered before. Otherwise, update it.
    if (idx === -1) {
      newValue.push(updatedField)
    } else {
      newValue[idx] = updatedField
    }
    dispatch("change", newValue)
  }

  const createInstance = (name, type) => {
    // Generate the next available field name if required
    if (!name) {
      name = generateIncrementedName({
        items: value,
        extractName: field => field.field,
        prefix: "Field",
      })
    }

    // Default to text field
    if (!type) {
      type = "@budibase/standard-components/stringfield"
    }

    // Make new instance
    return {
      ...store.actions.components.createInstance(type, {
        _instanceName: name,
        field: name,
        label: name,
        placeholder: name,
      }),
      active: true,
    }
  }

  const addField = () => {
    dispatch("change", [...value, createInstance()])
  }

  const removeField = id => {
    dispatch(
      "change",
      value.filter(field => field._id !== id)
    )
  }

  const changeFieldType = (id, newType) => {
    const idx = value.findIndex(field => field._id === id)
    if (idx === -1) {
      return
    }
    // Reuse existing ID to prevent closing the component popover
    const newField = {
      ...createInstance(value[idx].field, newType),
      _id: id,
    }
    dispatch("change", value.toSpliced(idx, 1, newField))
  }
</script>

<div class="field-configuration">
  <div class="toggle-all">
    <span>Fields</span>
    {#if !customSchema}
      <Toggle
        thin
        value={allActive}
        disabled={!value.length}
        on:change={e => {
          dispatch(
            "change",
            value.map(field => ({
              ...field,
              active: e.detail,
            }))
          )
        }}
      />
    {/if}
  </div>
  <DraggableList
    on:change
    on:itemChange={processItemUpdate}
    on:add={addField}
    items={value}
    listItemKey={"_id"}
    listType={FieldSetting}
    listTypeProps={{
      componentBindings,
      bindings: resolvedBindings,
      customSchema,
      removeField,
      changeFieldType,
    }}
    addButtonVisible={customSchema}
    addButtonText="Add field"
    addButtonDisabled={false}
  />
</div>

<style>
  .field-configuration {
    padding-top: 8px;
  }
  .toggle-all {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing-s);
  }
  .toggle-all :global(.spectrum-Switch) {
    margin-right: 0;
    padding-right: calc(var(--spacing-s) - 1px);
    min-height: unset;
  }
  .toggle-all :global(.spectrum-Switch .spectrum-Switch-switch) {
    margin: 0;
  }
  .toggle-all span {
    color: var(--spectrum-global-color-gray-700);
    font-size: 12px;
  }
</style>

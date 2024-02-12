<script>
  import DraggableList from "../DraggableList/DraggableList.svelte"
  import ButtonSetting from "./ButtonSetting.svelte"
  import { createEventDispatcher } from "svelte"
  import { store } from "builderStore"
  import { Helpers } from "@budibase/bbui"
  import { getEventContextBindings } from "builderStore/dataBinding"
  import { cloneDeep, isEqual } from "lodash/fp"
  import { generateIncrementedName } from "helpers/helpers"

  export let componentInstance
  export let componentBindings
  export let bindings
  export let value
  export let key
  export let nested
  export let max

  const dispatch = createEventDispatcher()

  let focusItem
  let cachedValue

  $: if (!isEqual(value, cachedValue)) {
    cachedValue = cloneDeep(value)
  }
  $: buttonList = sanitizeValue(cachedValue) || []
  $: buttonCount = buttonList.length
  $: eventContextBindings = getEventContextBindings({
    componentInstance,
    settingKey: key,
  })
  $: allBindings = [...bindings, ...eventContextBindings]
  $: itemProps = {
    componentBindings: componentBindings || [],
    bindings: allBindings,
    removeButton,
    nested,
  }
  $: canAddButtons = max == null || buttonList.length < max

  const sanitizeValue = val => {
    if (!Array.isArray(val)) {
      return null
    }
    return val?.map(button => {
      return button._component ? button : buildPseudoInstance(button)
    })
  }

  const processItemUpdate = e => {
    const updatedField = e.detail
    const newButtonList = [...buttonList]
    const fieldIdx = newButtonList.findIndex(pSetting => {
      return pSetting._id === updatedField?._id
    })
    if (fieldIdx === -1) {
      newButtonList.push(updatedField)
    } else {
      newButtonList[fieldIdx] = updatedField
    }
    dispatch("change", newButtonList)
  }

  const listUpdated = e => {
    dispatch("change", [...e.detail])
  }

  const buildPseudoInstance = cfg => {
    return store.actions.components.createInstance(
      `@budibase/standard-components/button`,
      {
        _instanceName: Helpers.uuid(),
        text: cfg.text,
        type: cfg.type || "primary",
      }
    )
  }

  const addButton = () => {
    const name = generateIncrementedName({
      items: buttonList,
      extractName: button => button.text,
      prefix: "Button",
    })
    const newButton = buildPseudoInstance({
      text: name,
    })
    dispatch("change", [...buttonList, newButton])
    focusItem = newButton._id
  }

  const removeButton = id => {
    dispatch(
      "change",
      buttonList.filter(button => button._id !== id)
    )
  }
</script>

<DraggableList
  on:change={listUpdated}
  on:itemChange={processItemUpdate}
  items={buttonList}
  listItemKey={"_id"}
  listType={ButtonSetting}
  listTypeProps={itemProps}
  focus={focusItem}
  draggable={buttonCount > 1}
  addButtonVisible
  addButtonText="Add button"
  addButtonDisabled={!canAddButtons}
  on:add={addButton}
/>

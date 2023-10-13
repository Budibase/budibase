<script>
  import DraggableList from "../DraggableList/DraggableList.svelte"
  import ButtonSetting from "./ButtonSetting.svelte"
  import {
    getBindableProperties,
    getComponentBindableProperties,
  } from "builderStore/dataBinding"
  import { createEventDispatcher, onMount } from "svelte"
  import { selectedScreen, store } from "builderStore"
  import { isEqual, cloneDeep } from "lodash"
  import { Helpers } from "@budibase/bbui"

  export let componentInstance
  export let value

  const dispatch = createEventDispatcher()

  let mounted
  let cachedValue
  let componentBindings = []
  let focusItem

  const updateState = value => {
    return (value || []).map((button, idx) => {
      if (!button._component) {
        return buildPseudoInstance({ ...button, name: `Button ${idx + 1}` })
      }
      return button
    })
  }

  const buildItemProps = buttonList => {
    return {
      componentBindings,
      bindings,
      removeButton,
      canRemove: buttonList?.length > 1,
    }
  }

  $: if (!isEqual(value, cachedValue) && mounted) {
    cachedValue = value ? cloneDeep(value) : []
  }
  $: buttonList = updateState(cachedValue)
  $: buttonCount = buttonList?.length
  $: bindings = getBindableProperties($selectedScreen, componentInstance._id)
  $: componentBindings = getComponentBindableProperties(
    $selectedScreen,
    componentInstance._id
  )
  $: itemProps = buildItemProps(buttonList)

  const processItemUpdate = e => {
    const updatedField = e.detail
    const parentButtonsUpdated = buttonList ? cloneDeep(buttonList) : []

    let parentFieldIdx = parentButtonsUpdated.findIndex(pSetting => {
      return pSetting._id === updatedField?._id
    })

    if (parentFieldIdx == -1) {
      parentButtonsUpdated.push(updatedField)
    } else {
      parentButtonsUpdated[parentFieldIdx] = updatedField
    }
    dispatch("change", parentButtonsUpdated)
  }

  const listUpdated = e => {
    dispatch("change", [...e.detail])
  }

  const buildPseudoInstance = cfg => {
    const pseudoComponentInstance = store.actions.components.createInstance(
      `@budibase/standard-components/button`,
      {
        _instanceName: Helpers.uuid(),
        text: cfg.name,
        type: cfg.type || "primary",
      },
      {}
    )

    return pseudoComponentInstance
  }

  const addButton = () => {
    const newButton = buildPseudoInstance({
      name: `Button ${buttonList.length + 1}`,
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

  onMount(() => {
    mounted = true
  })
</script>

<div class="button-configuration">
  {#if buttonList?.length}
    <DraggableList
      on:change={listUpdated}
      on:itemChange={processItemUpdate}
      items={buttonList}
      listItemKey={"_id"}
      listType={ButtonSetting}
      listTypeProps={itemProps}
      focus={focusItem}
      draggable={buttonCount > 1}
    />

    <div class="list-footer" on:click={addButton}>
      <div class="add-button">Add button</div>
    </div>
  {/if}
</div>

<style>
  .button-configuration :global(.spectrum-ActionButton) {
    width: 100%;
  }

  .button-configuration :global(.list-wrap > li:last-child),
  .button-configuration :global(.list-wrap) {
    border-bottom-left-radius: unset;
    border-bottom-right-radius: unset;
    border-bottom: 0px;
  }

  .list-footer {
    width: 100%;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    background-color: var(
      --spectrum-table-background-color,
      var(--spectrum-global-color-gray-50)
    );
    transition: background-color ease-in-out 130ms;
    display: flex;
    justify-content: center;
    border: 1px solid
      var(--spectrum-table-border-color, var(--spectrum-alias-border-color-mid));
    cursor: pointer;
  }

  .add-button {
    margin: var(--spacing-s);
  }

  .list-footer:hover {
    background-color: var(
      --spectrum-table-row-background-color-hover,
      var(--spectrum-alias-highlight-hover)
    );
  }
</style>

<script>
  import DraggableList from "../DraggableList/DraggableList.svelte"
  import ButtonSetting from "./ButtonSetting.svelte"
  import { createEventDispatcher } from "svelte"
  import { Helpers } from "@budibase/bbui"
  import { componentStore } from "stores/builder"

  export let componentBindings
  export let bindings
  export let value

  const dispatch = createEventDispatcher()

  let focusItem

  $: buttonList = sanitizeValue(value) || []
  $: buttonCount = buttonList.length
  $: itemProps = {
    componentBindings: componentBindings || [],
    bindings,
    removeButton,
    canRemove: buttonCount > 1,
  }

  const sanitizeValue = val => {
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
    return componentStore.createInstance(
      `@budibase/standard-components/button`,
      {
        _instanceName: Helpers.uuid(),
        text: cfg.text,
        type: cfg.type || "primary",
      },
      {}
    )
  }

  const addButton = () => {
    const newButton = buildPseudoInstance({
      text: `Button ${buttonCount + 1}`,
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

<div class="button-configuration">
  {#if buttonCount}
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

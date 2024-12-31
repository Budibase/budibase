<script>
  import DraggableList from "../DraggableList/DraggableList.svelte"
  import ButtonSetting from "./ButtonSetting.svelte"
  import { createEventDispatcher } from "svelte"
  import { Helpers, Menu, MenuItem, Popover } from "@budibase/bbui"
  import { componentStore } from "@/stores/builder"
  import { getEventContextBindings } from "@/dataBinding"
  import { cloneDeep, isEqual } from "lodash/fp"
  import { getRowActionButtonTemplates } from "@/templates/rowActions"

  export let componentInstance
  export let componentBindings
  export let bindings
  export let value
  export let key
  export let nested
  export let max

  const dispatch = createEventDispatcher()

  let cachedValue
  let rowActionTemplates = []
  let anchor
  let popover

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
    return componentStore.createInstance(
      `@budibase/standard-components/button`,
      {
        _instanceName: Helpers.uuid(),
        text: cfg.text,
        type: cfg.type || "primary",
      }
    )
  }

  const addCustomButton = () => {
    const newButton = buildPseudoInstance({
      text: `Button ${buttonCount + 1}`,
    })
    dispatch("change", [...buttonList, newButton])
    popover.hide()
  }

  const addRowActionTemplate = template => {
    dispatch("change", [...buttonList, template])
    popover.hide()
  }

  const addButton = async () => {
    rowActionTemplates = await getRowActionButtonTemplates({
      component: componentInstance,
    })
    if (rowActionTemplates.length) {
      popover.show()
    } else {
      addCustomButton()
    }
  }

  const removeButton = id => {
    dispatch(
      "change",
      buttonList.filter(button => button._id !== id)
    )
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="button-configuration">
  {#if buttonCount}
    <DraggableList
      on:change={listUpdated}
      on:itemChange={processItemUpdate}
      items={buttonList}
      listItemKey={"_id"}
      listType={ButtonSetting}
      listTypeProps={itemProps}
      draggable={buttonCount > 1}
    />
  {/if}
  <div
    bind:this={anchor}
    class="list-footer"
    class:disabled={!canAddButtons}
    on:click={addButton}
    class:empty={!buttonCount}
  >
    <div class="add-button">Add button</div>
  </div>
</div>

<Popover bind:this={popover} {anchor} useAnchorWidth resizable={false}>
  <Menu>
    <MenuItem on:click={addCustomButton}>Custom button</MenuItem>
    {#each rowActionTemplates as template}
      <MenuItem on:click={() => addRowActionTemplate(template)}>
        {template.text}
      </MenuItem>
    {/each}
  </Menu>
</Popover>

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
  .list-footer.empty {
    border-radius: 4px;
  }
  .list-footer.disabled {
    color: var(--spectrum-global-color-gray-500);
    pointer-events: none;
  }
  .list-footer:hover {
    background-color: var(
      --spectrum-table-row-background-color-hover,
      var(--spectrum-alias-highlight-hover)
    );
  }

  .add-button {
    margin: var(--spacing-s);
  }
</style>

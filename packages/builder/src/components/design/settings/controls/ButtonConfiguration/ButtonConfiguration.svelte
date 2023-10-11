<script>
  import DraggableList from "../DraggableList.svelte"
  import ButtonSetting from "./ButtonSetting.svelte"
  import {
    getBindableProperties,
    getComponentBindableProperties,
  } from "builderStore/dataBinding"
  import { createEventDispatcher, onMount } from "svelte"
  import { selectedScreen, store } from "builderStore"
  import { isEqual, cloneDeep } from "lodash"

  export let componentInstance
  export let value

  $: bindings = getBindableProperties($selectedScreen, componentInstance._id)

  const dispatch = createEventDispatcher()
  let buttonList
  let mounted
  let cachedValue
  let componentBindings = []

  $: componentBindings = getComponentBindableProperties(
    $selectedScreen,
    componentInstance._id
  )

  $: if (!isEqual(value, cachedValue) && mounted) {
    cachedValue = value
      ? cloneDeep(value)
      : [
          buildPseudoInstance({ name: `Button 1`, type: "cta" }),
          buildPseudoInstance({ name: `Button 2` }),
        ]
  }

  const updateState = value => {
    buttonList = value
  }

  $: updateState(cachedValue)

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
    console.log("On value update ", parentButtonsUpdated)
    dispatch("change", parentButtonsUpdated)
  }

  const listUpdated = e => {
    dispatch("change", [...e.detail])
  }

  // May not be necessary without
  const buildPseudoInstance = cfg => {
    const pseudoComponentInstance = store.actions.components.createInstance(
      `@budibase/standard-components/button`,
      {
        _instanceName: cfg.name,
        text: cfg.name,
        type: cfg.type || "primary",
      },
      {}
    )

    return pseudoComponentInstance
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
      listTypeProps={{
        componentBindings,
        bindings,
      }}
    />
  {/if}
</div>

<style>
  .button-configuration :global(.spectrum-ActionButton) {
    width: 100%;
  }
</style>

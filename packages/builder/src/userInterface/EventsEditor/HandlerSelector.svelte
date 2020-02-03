<script>
  import IconButton from "../../common/IconButton.svelte"
  import PlusButton from "../../common/PlusButton.svelte"
  import Select from "../../common/Select.svelte"
  import StateBindingControl from "../StateBindingControl.svelte"
  import { find, map, keys, reduce, keyBy } from "lodash/fp"
  import { pipe, userWithFullAccess } from "../../common/core"
  import {
    EVENT_TYPE_MEMBER_NAME,
    allHandlers,
  } from "../../common/eventHandlers"
  import { store } from "../../builderStore"

  export let handler
  export let onCreate
  export let onChanged
  export let onRemoved

  export let index
  export let newHandler

  let eventOptions
  let handlerType
  let parameters = []

  $: eventOptions = allHandlers(
    { hierarchy: $store.hierarchy },
    userWithFullAccess({
      hierarchy: $store.hierarchy,
      actions: keyBy("name")($store.actions),
    })
  )

  $: {
    if (handler) {
      handlerType = handler[EVENT_TYPE_MEMBER_NAME]
      parameters = Object.entries(handler.parameters).map(([name, value]) => ({
        name,
        value,
      }))
    } else {
      // Empty Handler
      handlerType = ""
      parameters = []
    }
  }

  const handlerChanged = (type, params) => {
    const handlerParams = {}
    for (let param of params) {
      handlerParams[param.name] = param.value
    }

    const updatedHandler = {
      [EVENT_TYPE_MEMBER_NAME]: type,
      parameters: handlerParams,
    }

    onChanged(updatedHandler, index)
  }

  const handlerTypeChanged = e => {
    const handlerType = eventOptions.find(
      handler => handler.name === e.target.value
    )
    const defaultParams = handlerType.parameters.map(param => ({
      name: param,
      value: "",
    }))

    handlerChanged(handlerType.name, defaultParams)
  }

  const onParameterChanged = index => value => {
    const newParams = [...parameters]
    newParams[index].value = value
    handlerChanged(handlerType, newParams)
  }
</script>

<div class="type-selector-container {newHandler && 'new-handler'}">
  <div class="handler-controls">
    <div class="handler-option">
      <span>Action</span>
      <Select value={handlerType} on:change={handlerTypeChanged}>
        <option />
        {#each eventOptions as option}
          <option value={option.name}>{option.name}</option>
        {/each}
      </Select>
    </div>
    {#if parameters}
      {#each parameters as param, idx}
        <div class="handler-option">
          <span>{param.name}</span>
          <StateBindingControl
            onChanged={onParameterChanged(idx)}
            value={param.value} />
        </div>
      {/each}
    {/if}
  </div>
  <div class="event-action-button">
    {#if parameters.length > 0}
      {#if newHandler}
        <PlusButton on:click={onCreate} />
      {:else}
        <IconButton icon="x" on:click={onRemoved} />
      {/if}
    {/if}
  </div>
</div>

<style>
  .type-selector-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(223, 223, 223, 0.5);
    border: 1px solid #dfdfdf;
    margin-bottom: 18px;
  }

  .handler-option {
    display: flex;
    flex-direction: column;
  }

  .new-handler {
    background: #fff;
  }

  .handler-controls {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 10px;
    padding: 22px;
  }

  .event-action-button {
    margin-right: 20px;
  }

  span {
    font-size: 12px;
    margin-bottom: 5px;
  }
</style>

<script>
  import { Button, Select } from "@budibase/bbui"
  import IconButton from "components/common/IconButton.svelte"
  import StateBindingCascader from "./StateBindingCascader.svelte"
  import { find, map, keys, reduce, keyBy } from "lodash/fp"
  import { pipe } from "components/common/core"
  import {
    EVENT_TYPE_MEMBER_NAME,
    allHandlers,
  } from "components/common/eventHandlers"
  import { store } from "builderStore"

  export let handler
  export let onCreate
  export let onChanged
  export let onRemoved

  export let index
  export let newHandler

  let eventOptions
  let handlerType
  let parameters = []

  $: eventOptions = allHandlers()

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

  const onParameterChanged = index => e => {
    const value = e.target ? e.target.value : e
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
      <br />
      {#each parameters as parameter, idx}
        <StateBindingCascader on:change={onParameterChanged(idx)} {parameter} />
      {/each}
    {/if}
    {#if parameters.length > 0}
      <div class="button-container">
        {#if newHandler}
          <Button primary thin on:click={onCreate}>Add Action</Button>
        {:else}
          <Button outline thin on:click={onRemoved}>Remove Action</Button>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .type-selector-container {
    display: grid;
    grid-gap: 20px;
    width: 100%;
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
    grid-template-columns: 1fr;
    grid-gap: 20px;
    padding: 22px;
  }

  .button-container {
    display: grid;
    justify-items: end;
  }

  span {
    font-size: 18px;
    margin-bottom: 10px;
    font-weight: 500;
  }
</style>

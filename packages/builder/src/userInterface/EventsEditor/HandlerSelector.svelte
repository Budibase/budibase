<script>
  import IconButton from "../../common/IconButton.svelte";
  import StateBindingControl from "./StateBindingControl.svelte";
  import { find, map, keys, reduce, keyBy } from "lodash/fp";
  import { pipe, userWithFullAccess } from "../../common/core";
  import {
    EVENT_TYPE_MEMBER_NAME,
    allHandlers
  } from "../../common/eventHandlers";
  import { store } from "../../builderStore";

  export let handler;
  export let onChanged;
  export let onRemoved;
  export let index;

  let eventOptions;
  let handlerType;
  let parameters = [];

  $: eventOptions = allHandlers(
    { hierarchy: $store.hierarchy },
    userWithFullAccess({
      hierarchy: $store.hierarchy,
      actions: keyBy("name")($store.actions)
    })
  );

  // TODO: refactor
  $: {
    if (handler) {
      handlerType = handler[EVENT_TYPE_MEMBER_NAME];
      parameters = Object.entries(handler.parameters).map(([name, value]) => ({
        name,
        value
      }));
    } else {
      handlerType = "";
      parameters = [];
    }
  }

  const handlerChanged = (type, params) => {
    const handlerParams = {};
    for (let param of params) {
      handlerParams[param.name] = param.value;
    }

    const updatedHandler = {
      [EVENT_TYPE_MEMBER_NAME]: type,
      parameters: handlerParams
    };

    onChanged(updatedHandler, index);
  };

  const handlerTypeChanged = e => {
    const handlerType = eventOptions.find(
      handler => handler.name === e.target.value
    );
    // Set default params for handler
    const defaultParams = handlerType.parameters.map(param => ({
      name: param,
      value: ""
    }));
    handlerChanged(handlerType.name, defaultParams);
  };

  const onParameterChanged = index => value => {
    const newParams = [...parameters];
    newParams[index].value = value;
    handlerChanged(handlerType, newParams);
  };
</script>

<style>
  .type-selector-container {
    display: grid;
    grid-template-rows: repeat(3, 1fr);
    background: #fafafa;
    padding: 22px;
    border: 1px solid var(--primary75);
  }

  .type-selector {
    border-color: var(--primary50);
    border-radius: 2px;
    width: 50px;
    flex: 1 0 auto;
  }
</style>

<div class="type-selector-container">
  Action
  <select
    class="type-selector uk-select uk-form-small "
    value={handlerType}
    on:change={handlerTypeChanged}>
    <option />
    {#each eventOptions as option}
      <option value={option.name}>{option.name}</option>
    {/each}
  </select>
  {#if parameters}
    {#each parameters as param, index}
      <div>{param.name}</div>
      <StateBindingControl
        onChanged={onParameterChanged(index)}
        value={param.value} />
    {/each}
  {/if}
</div>

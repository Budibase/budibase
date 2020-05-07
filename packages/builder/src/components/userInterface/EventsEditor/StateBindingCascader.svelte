<script>
  import IconButton from "components/common/IconButton.svelte"
  import PlusButton from "components/common/PlusButton.svelte"
  import Select from "components/common/Select.svelte"
  import Input from "components/common/Input.svelte"
  import { find, map, keys, reduce, keyBy } from "lodash/fp"
  import { pipe } from "components/common/core"
  import {
    EVENT_TYPE_MEMBER_NAME,
    allHandlers,
  } from "components/common/eventHandlers"
  import { store } from "builderStore"
  import StateBindingOptions from "../PropertyCascader/StateBindingOptions.svelte"
  import { ArrowDownIcon } from "components/common/Icons/"

  export let parameter
  export let onChange

  let isOpen = false
</script>

<div class="handler-option">
  <span>{parameter.name}</span>
  <div class="handler-input">
    <Input on:change={onChange} value={parameter.value} />
    <button on:click={() => (isOpen = !isOpen)}>
      <div class="icon" style={`transform: rotate(${isOpen ? 0 : 90}deg);`}>
        <ArrowDownIcon size={36} />
      </div>
    </button>
    {#if isOpen}
      <StateBindingOptions
        onSelect={option => {
          onChange(option)
          isOpen = false
        }} />
    {/if}
  </div>
</div>

<style>
  button {
    cursor: pointer;
    outline: none;
    border: none;
    border-radius: 5px;
    background: rgba(249, 249, 249, 1);

    font-size: 1.6rem;
    font-weight: 700;
    color: rgba(22, 48, 87, 1);
    margin-left: 5px;
  }

  .icon {
    width: 24px;
  }

  .handler-option {
    display: flex;
    flex-direction: column;
  }

  .handler-input {
    position: relative;
    display: flex;
  }

  span {
    font-size: 13px;
    margin-bottom: 5px;
  }
</style>

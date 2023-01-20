<script>
  import { createEventDispatcher } from "svelte"
  import FancyField from "./FancyField.svelte"
  import Checkbox from "../Form/Core/Checkbox.svelte"

  export let value
  export let text
  export let disabled = false
  export let error = null
  export let validate = null

  const dispatch = createEventDispatcher()

  const onChange = () => {
    const newValue = !value
    dispatch("change", newValue)
    value = newValue
    if (validate) {
      error = validate(newValue)
    }
  }
</script>

<FancyField {error} {value} {validate} {disabled} clickable on:click={onChange}>
  <span>
    <Checkbox {disabled} {value} />
  </span>
  <div class="text">
    {#if text}
      {text}
    {/if}
    <slot />
  </div>
</FancyField>

<style>
  span {
    pointer-events: none;
  }
  .text {
    font-size: 15px;
    line-height: 17px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .text > :global(*) {
    font-size: inherit !important;
  }
</style>

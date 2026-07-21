<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import FancyField from "./FancyField.svelte"
  import Checkbox from "../Form/Core/Checkbox.svelte"

  export let value: boolean | undefined = undefined
  export let text: string | undefined = undefined
  export let disabled: boolean = false
  export let error: string | null = null
  export let validate: ((value: boolean | undefined) => string | null) | null =
    null
  export let indeterminate: boolean = false
  export let compact: boolean = false

  const dispatch = createEventDispatcher<{ change: boolean }>()

  const onChange = () => {
    const newValue = !value
    dispatch("change", newValue)
    value = newValue
    if (validate) {
      error = validate(newValue)
    }
  }
</script>

<FancyField
  {error}
  {value}
  {validate}
  {disabled}
  {compact}
  clickable
  on:click={onChange}
>
  <span>
    <Checkbox {disabled} {value} {indeterminate} />
  </span>
  <div class="text" class:compact>
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
  .text.compact {
    font-size: 13px;
    line-height: 15px;
  }
  .text > :global(*) {
    font-size: inherit !important;
  }
</style>

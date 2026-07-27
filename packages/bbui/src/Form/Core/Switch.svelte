<script lang="ts">
  import "@spectrum-css/switch/dist/index-vars.css"
  import { createEventDispatcher } from "svelte"

  export let value: boolean = false
  export let id: string | null = null
  export let text: string | null = null
  export let disabled: boolean = false
  export let noPadding: boolean = false
  export let noMargin: boolean = false

  const dispatch = createEventDispatcher()
  const onChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    dispatch("change", target.checked)
  }
</script>

<div
  class="spectrum-Switch spectrum-Switch--emphasized"
  class:noPadding
  class:noMargin
>
  <input
    checked={value}
    {disabled}
    on:change={onChange}
    on:click
    on:click|stopPropagation
    {id}
    type="checkbox"
    class="spectrum-Switch-input"
  />
  <span class="spectrum-Switch-switch"></span>
  {#if text}
    <label class="spectrum-Switch-label" for={id}>{text}</label>
  {/if}
</div>

<style>
  .spectrum-Switch-input {
    opacity: 0;
  }
  .noPadding {
    padding: 0;
    margin: 0;
  }
  .spectrum-Switch.noMargin {
    --spectrum-switch-cursor-hit-x: 0;
  }
</style>

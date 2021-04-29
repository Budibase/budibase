<script>
  import Flatpickr from "svelte-flatpickr"
  import { Label, Input } from "../"
  import "flatpickr/dist/flatpickr.css"

  const PICKER_OPTIONS = {
    enableTime: true,
  }

  export let label
  export let placeholder
  export let value
  export let thin = false
</script>

<div class:thin>
  {#if label}
    <Label extraSmall grey>{label}</Label>
  {/if}
  <Flatpickr {placeholder} options={PICKER_OPTIONS} on:change bind:value />
</div>

<style>
  :global(.flatpickr-input) {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    color: var(--ink);
    border-radius: 5px;
    border: none;
    background-color: var(--grey-2);
    padding: var(--spacing-m);
    font-size: var(--font-size-s);
    margin: 0;
    outline: none;
    border: var(--border-transparent);
  }
  :global(.flatpickr-input:focus) {
    border: var(--border-blue);
  }

  div.thin :global(.flatpickr-input) {
    font-size: var(--font-size-xs);
  }
</style>

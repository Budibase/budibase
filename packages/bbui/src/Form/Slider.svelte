<script>
  import Label from "../Styleguide/Label.svelte"

  export let label
  export let min = 0
  export let max = 100
  export let step = 1
  export let value
  export let showValue = false
  export let showRange = false
</script>

<div>
  {#if label}
    <Label extraSmall grey>
      {label}
      {#if showValue && value != null}({value}){/if}
    </Label>
  {/if}
  <div class="container">
    {#if showRange && min != null}<span>{min}</span>{/if}
    <input type="range" bind:value {min} {max} {step} />
    {#if showRange && max != null}<span>{max}</span>{/if}
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: var(--spacing-s);
  }

  span {
    flex: 0 0 auto;
    color: var(--grey-5);
    font-family: var(--font-sans);
    font-size: var(--font-size-xs);
    font-weight: 400;
  }

  input[type="range"] {
    width: 100%;
    margin: 0;
    background-color: transparent;
    -webkit-appearance: none;
    flex: 1 1 auto;
  }
  input[type="range"]:focus {
    outline: none;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    background: var(--grey-4);
    border-radius: 9px;
    width: 100%;
    height: 18px;
    cursor: pointer;
    padding: 0 2px;
  }
  input[type="range"]::-webkit-slider-thumb {
    width: 14px;
    height: 14px;
    background: white;
    border-radius: 100%;
    cursor: pointer;
    -webkit-appearance: none;
    border: none;
    margin-top: 2px;
  }
  input[type="range"]::-moz-range-track {
    background: var(--grey-4);
    border-radius: 9px;
    width: 100%;
    height: 18px;
    cursor: pointer;
    padding: 0 2px;
  }
  input[type="range"]::-moz-range-thumb {
    width: 14px;
    height: 14px;
    background: white;
    border-radius: 100%;
    cursor: pointer;
    border: none;
  }
</style>

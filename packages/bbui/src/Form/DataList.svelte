<script>
  import Icon from "../Icons/Icon.svelte"
  import Label from "../Styleguide/Label.svelte"
  import { createEventDispatcher } from "svelte"

  export let label = undefined
  export let value = ""
  export let name = undefined
  export let thin = false
  export let extraThin = false
  export let secondary = false
  export let outline = false
  export let disabled = false

  const dispatch = createEventDispatcher()
  let focus = false

  const updateValue = e => {
    value = e.target.value
  }

  function handleFocus(e) {
    focus = true
    dispatch("focus", e)
  }

  function handleBlur(e) {
    focus = false
    dispatch("blur", e)
  }
</script>

{#if label}
  <Label extraSmall grey forAttr={name}>{label}</Label>
{/if}
<div class="container" class:disabled class:secondary class:outline class:focus>
  <select
    {name}
    class:thin
    class:extraThin
    class:secondary
    {disabled}
    on:change
    on:focus={handleFocus}
    on:blur={handleBlur}
    bind:value>
    <slot />
  </select>
  <slot name="custom-input" />
  <input
    class:thin
    class:extraThin
    class:secondary
    class:disabled
    {disabled}
    on:change={updateValue}
    on:input={updateValue}
    on:focus={handleFocus}
    on:blur={e => {
      updateValue(e)
      handleBlur(e)
    }}
    value={value || ''}
    type="text" />
  <div class="pointer editable-pointer">
    <Icon name="arrowdown" />
  </div>
</div>

<style>
  .container {
    position: relative !important;
    display: block;
    border-radius: var(--border-radius-s);
    border: var(--border-transparent);
    background-color: var(--background);
  }
  .container.outline {
    border: var(--border-dark);
  }
  .container.focus {
    border: var(--border-blue);
  }

  input,
  select {
    border-radius: var(--border-radius-s);
    font-size: var(--font-size-m);
    outline: none;
    border: none;
    color: var(--ink);
    text-align: left;
    background-color: transparent;
  }
  select {
    display: block !important;
    width: 100% !important;
    padding: var(--spacing-m) 2rem var(--spacing-m) var(--spacing-m);
    appearance: none !important;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    align-items: center;
    white-space: pre;
    opacity: 0;
  }
  input {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(100% - 30px);
    height: 100%;
    border: none;
    box-sizing: border-box;
    padding: var(--spacing-m) 0 var(--spacing-m) var(--spacing-m);
  }

  select.thin,
  input.thin {
    font-size: var(--font-size-xs);
  }
  select.extraThin,
  input.extraThin {
    font-size: var(--font-size-xs);
    padding: var(--spacing-s) 0 var(--spacing-s) var(--spacing-m);
  }
  .secondary {
    background: var(--grey-2);
  }

  select:disabled,
  input:disabled,
  .disabled {
    background: var(--grey-4);
    color: var(--grey-6);
  }

  .pointer {
    right: 0 !important;
    top: 0 !important;
    bottom: 0 !important;
    position: absolute !important;
    pointer-events: none !important;
    align-items: center !important;
    display: flex !important;
    box-sizing: border-box;
  }

  .editable-pointer {
    border-style: solid;
    border-width: 0 0 0 1px;
    border-color: var(--grey-4);
    padding-left: var(--spacing-xs);
  }
  .editable-pointer :global(svg) {
    margin-right: var(--spacing-xs);
    fill: var(--ink);
  }
</style>

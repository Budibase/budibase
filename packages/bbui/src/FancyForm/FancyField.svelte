<script>
  import Icon from "../Icon/Icon.svelte"
  import { getContext, onMount } from "svelte"
  import { slide } from "svelte/transition"

  export let disabled = false
  export let error = null
  export let focused = false
  export let clickable = false
  export let validate
  export let value
  export let ref
  export let autoHeight

  const formContext = getContext("fancy-form")
  const id = Math.random()
  const API = {
    validate: () => {
      if (validate) {
        error = validate(value)
      }
      return !error
    },
  }

  onMount(() => {
    if (formContext) {
      formContext.registerField(id, API)
    }
    return () => {
      if (formContext) {
        formContext.unregisterField(id)
      }
    }
  })
</script>

<div
  bind:this={ref}
  class="fancy-field"
  class:error
  class:disabled
  class:focused
  class:clickable
  class:auto-height={autoHeight}
>
  <div class="content" on:click>
    <div class="field">
      <slot />
    </div>
    {#if error}
      <div class="error-icon">
        <Icon name="Alert" />
      </div>
    {/if}
  </div>
  {#if error}
    <div transition:slide|local={{ duration: 130 }} class="error-message">
      {error}
    </div>
  {/if}
</div>

<style>
  .fancy-field {
    max-width: 400px;
    background: var(--spectrum-global-color-gray-75);
    border: 1px solid var(--spectrum-global-color-gray-300);
    border-radius: 4px;
    box-sizing: border-box;
    transition: border-color 130ms ease-out, background 130ms ease-out,
      background 130ms ease-out;
    color: var(--spectrum-global-color-gray-800);
  }
  .fancy-field:hover {
    border-color: var(--spectrum-global-color-gray-400);
  }
  .fancy-field.clickable:hover {
    background: var(--spectrum-global-color-gray-200);
    cursor: pointer;
  }
  .fancy-field.focused {
    border-color: var(--spectrum-global-color-blue-400);
  }
  .fancy-field.error {
    border-color: var(--spectrum-global-color-red-400);
  }
  .fancy-field.disabled {
    background: var(--spectrum-global-color-gray-200);
    color: var(--spectrum-global-color-gray-400);
    border: 1px solid var(--spectrum-global-color-gray-300);
    pointer-events: none;
  }
  .content {
    position: relative;
    height: 64px;
    padding: 0 16px;
  }
  .fancy-field.auto-height .content {
    height: auto;
  }
  .content,
  .field {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 16px;
  }
  .field {
    flex: 1 1 auto;
  }
  .error-message {
    background: var(--spectrum-global-color-red-400);
    color: white;
    font-size: 14px;
    padding: 6px 16px;
    font-weight: 500;
  }
  .error-icon {
    flex: 0 0 auto;
  }
  .error-icon :global(.spectrum-Icon) {
    fill: var(--spectrum-global-color-red-400);
  }
</style>

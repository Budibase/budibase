<script>
  export let disabled = false
  export let error = null
  export let focused = false
  export let clickable = false
</script>

<div
  class="fancy-field"
  class:error
  class:disabled
  class:focused
  class:clickable
>
  <div class="content" on:click>
    <slot />
  </div>
  {#if error}
    <div class="error-message">
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
    height: 64px;
    padding: 0 16px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 16px;
    position: relative;
  }
  .error-message {
    background: var(--spectrum-global-color-red-400);
    color: white;
    font-size: 14px;
    padding: 6px 16px;
    font-weight: 500;
  }
</style>

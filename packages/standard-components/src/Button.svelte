<script>
  import { styleable } from "@budibase/component-sdk"

  export let className = "default"
  export let disabled = false
  export let text
  export let styles

  let theButton
</script>

<button
  bind:this={theButton}
  class="default"
  disabled={disabled || false}
  use:styleable={styles}>
  {text}
</button>

<style>
  .default {
    align-items: center;
    padding: var(--spacing-s) var(--spacing-l);
    box-sizing: border-box;
    border-radius: 4px;
    outline: none;
    cursor: pointer;
    transition: all 0.2s ease 0s;
    overflow: hidden;
    outline: none;
    user-select: none;
    white-space: nowrap;
    text-align: center;
  }
</style>

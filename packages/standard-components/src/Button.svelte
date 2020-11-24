<script>
  import { getContext } from "svelte"

  const { styleable } = getContext("sdk")
  const styles = getContext("style")

  export let className = "default"
  export let disabled = false
  export let text
</script>

<button class="default" disabled={disabled || false} use:styleable={$styles}>
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

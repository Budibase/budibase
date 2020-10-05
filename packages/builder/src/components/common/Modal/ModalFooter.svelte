<script>
  import { getContext } from "svelte"
  import { Button } from "@budibase/bbui"
  import { ContextKey } from "./context"

  export let cancelText = "Cancel"
  export let confirmText = "Confirm"
  export let showCancelButton = true
  export let showConfirmButton = true
  export let onConfirm

  const modalContext = getContext(ContextKey)
  let loading = false

  function hide() {
    modalContext.hide()
  }

  async function confirm() {
    loading = true
    if (!onConfirm || (await onConfirm()) !== false) {
      hide()
    }
    loading = false
  }
</script>

<footer>
  <div class="content">
    <slot />
  </div>
  <div class="buttons">
    {#if showCancelButton}
      <Button secondary on:click={hide}>{cancelText}</Button>
    {/if}
    {#if showConfirmButton}
      <Button
        primary
        {...$$restProps}
        disabled={$$props.disabled || loading}
        on:click={confirm}>
        {confirmText}
      </Button>
    {/if}
  </div>
</footer>

<style>
  footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
  }
  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spacing-m);
  }
</style>

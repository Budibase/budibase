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

  function hide() {
    modalContext.hide()
  }

  async function confirm() {
    if (!onConfirm || (await onConfirm()) !== false) {
      hide()
    }
  }
</script>

{#if showCancelButton || showConfirmButton}
  <footer>
    {#if showCancelButton}
      <Button secondary on:click={hide}>{cancelText}</Button>
    {/if}
    {#if showConfirmButton}
      <Button primary {...$$restProps} on:click={confirm}>{confirmText}</Button>
    {/if}
  </footer>
{/if}

<style>
  footer {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spacing-m);
  }
</style>

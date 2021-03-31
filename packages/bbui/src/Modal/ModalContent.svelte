<script>
  import { createEventDispatcher, getContext } from "svelte"
  import Button from "../Button/Button.svelte"
  import Icon from "../Icons/Icon.svelte"
  import Context from "../context"
  const dispatch = createEventDispatcher()

  export let title = undefined
  export let cancelText = "Cancel"
  export let confirmText = "Confirm"
  export let showCancelButton = true
  export let showConfirmButton = true
  export let showCloseIcon = true
  export let onConfirm = undefined
  export let disabled = false

  const { hide } = getContext(Context.Modal)
  let loading = false
  $: confirmDisabled = disabled || loading

  async function confirm() {
    loading = true
    if (!onConfirm || (await onConfirm()) !== false) {
      hide()
    }
    loading = false
  }
</script>

<div class="modal-content">
  {#if title}
    <header>
      <h5>{title}</h5>
      <div class="header-content">
        <slot name="header" />
      </div>
    </header>
  {/if}
  <slot />
  {#if showCancelButton || showConfirmButton}
    <footer>
      <div class="footer-content">
        <slot name="footer" />
      </div>
      <div class="buttons">
        {#if showCancelButton}
          <Button secondary on:click={hide}>{cancelText}</Button>
        {/if}
        {#if showConfirmButton}
          <Button
            primary
            {...$$restProps}
            disabled={confirmDisabled}
            on:click={confirm}>
            {confirmText}
          </Button>
        {/if}
      </div>
    </footer>
  {/if}
  {#if showCloseIcon}
    <div class="close-icon" on:click={hide}>
      <Icon name="closeline" />
    </div>
  {/if}
</div>

<style>
  .modal-content {
    display: grid;
    position: relative;
    gap: var(--spacing-xl);
    color: var(--ink);
  }

  header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-right: 40px;
  }
  header h5 {
    margin: 0;
    font-weight: 500;
  }

  .header-content {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }

  .close-icon {
    position: absolute;
    top: 0;
    right: 0;
    color: var(--ink);
    font-size: var(--font-size-m);
  }
  .close-icon:hover {
    color: var(--grey-6);
    cursor: pointer;
  }
  .close-icon :global(svg) {
    margin-right: 0;
  }

  footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: var(--spacing-m);
  }

  .footer-content {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: var(--spacing-m);
  }
</style>

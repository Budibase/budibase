<script>
  import "@spectrum-css/divider/dist/index-vars.css"

  import { getContext } from "svelte"
  import Button from "../Button/Button.svelte"
  import Icon from "../Icons/Icon.svelte"
  import Context from "../context"

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

<div class="spectrum-Dialog spectrum-Dialog--medium" role="dialog" tabindex="-1" aria-modal="true">
  <div class="spectrum-Dialog-grid">
    <h1 class="spectrum-Dialog-heading">{title}</h1>
    <hr class="spectrum-Divider spectrum-Divider--sizeS spectrum-Divider--horizontal spectrum-Dialog-divider">
    
    <!-- TODO: Remove content-grid class once Layout components are in bbui -->
    <section class="spectrum-Dialog-content content-grid">
      <slot />
    </section>
    {#if showCancelButton || showConfirmButton}
      <div class="spectrum-ButtonGroup spectrum-Dialog-buttonGroup spectrum-Dialog-buttonGroup--noFooter">
        <footer class="footer-content">
          <slot name="footer" />
        </footer>
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
      </div>
    {/if}
    {#if showCloseIcon}
      <div class="close-icon" on:click={hide}>
        <Icon name="closeline" />
      </div>
    {/if}
  </div>
</div>


<style>
  .content-grid {
    display: grid;
    position: relative;
    gap: var(--spacing-xl);
    color: var(--ink);
  }

  h1 {
    font-weight: normal;
  }
  .close-icon {
    position: absolute;
    top: 15px;
    right: 15px;
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

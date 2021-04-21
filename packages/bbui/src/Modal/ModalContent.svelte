<script>
  import "@spectrum-css/dialog/dist/index-vars.css"
  import { getContext } from "svelte"
  import Button from "../Button/Button.svelte"
  import Heading from "../Typography/Heading.svelte"
  import Divider from "../Divider/Divider.svelte"
  import Icon from "../Icon/Icon.svelte"
  import Context from "../context"

  export let title = undefined
  export let size = "small"
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

<div
  class="spectrum-Dialog spectrum-Dialog--{size}"
  style="position: relative;"
  role="dialog"
  tabindex="-1"
  aria-modal="true">
  <div class="spectrum-Dialog-grid">
    <h1 class="spectrum-Dialog-heading spectrum-Dialog-heading--noHeader">
      {title}
    </h1>

    <Divider m />
    <!-- TODO: Remove content-grid class once Layout components are in bbui -->
    <section class="spectrum-Dialog-content content-grid">
      <slot />
    </section>
    {#if showCancelButton || showConfirmButton}
      <div
        class="spectrum-ButtonGroup spectrum-Dialog-buttonGroup spectrum-Dialog-buttonGroup--noFooter">
        <slot name="footer" />
        {#if showCancelButton}
          <Button group secondary on:click={hide}>{cancelText}</Button>
        {/if}
        {#if showConfirmButton}
          <Button
            group
            cta
            {...$$restProps}
            disabled={confirmDisabled}
            on:click={confirm}>
            {confirmText}
          </Button>
        {/if}
      </div>
    {/if}
    {#if showCloseIcon}
      <div class="close-icon" on:click={hide}>
        <Icon name="Close" />
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

  .spectrum-Dialog-content {
    overflow: visible;
  }

  .spectrum-Dialog-buttonGroup {
    gap: var(--spectrum-global-dimension-static-size-200);
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
</style>

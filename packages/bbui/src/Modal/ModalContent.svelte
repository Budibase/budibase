<script context="module">
  export const keepOpen = Symbol("keepOpen")
</script>

<script>
  import "@spectrum-css/dialog/dist/index-vars.css"
  import { getContext } from "svelte"
  import Button from "../Button/Button.svelte"
  import Divider from "../Divider/Divider.svelte"
  import Icon from "../Icon/Icon.svelte"
  import Context from "../context"
  import ProgressCircle from "../ProgressCircle/ProgressCircle.svelte"

  export let title = undefined
  export let size = "S"
  export let cancelText = "Cancel"
  export let confirmText = "Confirm"
  export let showCancelButton = true
  export let showConfirmButton = true
  export let showCloseIcon = true
  export let onConfirm = undefined
  export let onCancel = undefined
  export let disabled = false
  export let showDivider = true

  export let showSecondaryButton = false
  export let secondaryButtonText = undefined
  export let secondaryAction = undefined
  export let secondaryButtonWarning = false
  export let custom = false

  const { hide, cancel } = getContext(Context.Modal)

  let loading = false

  $: confirmDisabled = disabled || loading

  async function secondary(e) {
    loading = true
    if (!secondaryAction || (await secondaryAction(e)) !== keepOpen) {
      hide()
    }
    loading = false
  }

  export async function confirm() {
    loading = true
    if (!onConfirm || (await onConfirm()) !== keepOpen) {
      hide()
    }
    loading = false
  }

  async function close() {
    loading = true
    if (!onCancel || (await onCancel()) !== keepOpen) {
      cancel()
    }
    loading = false
  }
</script>

<div
  class="spectrum-Dialog"
  class:spectrum-Dialog--small={size === "S"}
  class:spectrum-Dialog--medium={size === "M"}
  class:spectrum-Dialog--large={size === "L"}
  class:spectrum-Dialog--extraLarge={size === "XL"}
  class:no-grid={custom}
  style="position: relative;"
  role="dialog"
  tabindex="-1"
  aria-modal="true"
>
  <div class="modal-core" class:spectrum-Dialog-grid={!custom}>
    {#if title || $$slots.header}
      <h1
        class="spectrum-Dialog-heading spectrum-Dialog-heading--noHeader"
        class:noDivider={!showDivider}
        class:header-spacing={$$slots.header}
      >
        {#if title}
          {title}
        {:else if $$slots.header}
          <slot name="header" />
        {/if}
      </h1>
      {#if showDivider}
        <Divider />
      {/if}
    {/if}

    <!-- TODO: Remove content-grid class once Layout components are in bbui -->
    <section class="spectrum-Dialog-content content-grid">
      <slot {loading} />
    </section>
    {#if showCancelButton || showConfirmButton || $$slots.footer}
      <div
        class="spectrum-ButtonGroup spectrum-Dialog-buttonGroup spectrum-Dialog-buttonGroup--noFooter"
      >
        <slot name="footer" />
        {#if showSecondaryButton && secondaryButtonText && secondaryAction}
          <div class="secondary-action">
            <Button
              group
              secondary
              warning={secondaryButtonWarning}
              on:click={secondary}>{secondaryButtonText}</Button
            >
          </div>
        {/if}

        {#if showCancelButton}
          <Button group secondary on:click={close}>
            {cancelText}
          </Button>
        {/if}
        {#if showConfirmButton}
          <span class="confirm-wrap">
            <Button
              group
              cta
              {...$$restProps}
              disabled={confirmDisabled}
              on:click={confirm}
            >
              {#if loading}
                <ProgressCircle overBackground={true} size="S" />
              {/if}
              {#if !loading}
                {confirmText}
              {/if}
            </Button>
          </span>
        {/if}
      </div>
    {/if}
    {#if showCloseIcon}
      <div class="close-icon">
        <Icon hoverable name="Close" on:click={cancel} />
      </div>
    {/if}
  </div>
</div>

<style>
  .spectrum-Dialog--extraLarge {
    width: 1000px;
  }
  .spectrum-Dialog--medium {
    width: 540px;
  }

  .content-grid {
    display: grid;
    position: relative;
    gap: var(--spacing-xl);
  }

  .spectrum-Dialog-content {
    overflow: visible;
  }

  .no-grid .spectrum-Dialog-content {
    border-top: 2px solid var(--spectrum-global-color-gray-200);
    border-bottom: 2px solid var(--spectrum-global-color-gray-200);
  }

  .no-grid .spectrum-Dialog-heading {
    margin-top: 12px;
    margin-left: 12px;
  }

  .spectrum-Dialog.no-grid {
    width: 100%;
  }

  .spectrum-Dialog.no-grid .spectrum-Dialog-buttonGroup {
    padding: 12px;
  }

  .spectrum-Dialog-heading {
    font-family: var(--font-accent);
    font-weight: 600;
  }
  .spectrum-Dialog-heading.noDivider {
    margin-bottom: 12px;
  }

  .spectrum-Dialog-buttonGroup {
    gap: var(--spectrum-global-dimension-static-size-200);
  }

  .close-icon {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: var(--font-size-m);
  }
  .close-icon :global(svg) {
    margin-right: 0;
  }

  .header-spacing {
    display: flex;
    justify-content: space-between;
  }

  .secondary-action {
    margin-right: auto;
  }

  .spectrum-Dialog-buttonGroup {
    padding-left: 0;
  }

  .confirm-wrap :global(.spectrum-Button-label) {
    display: contents;
  }
</style>

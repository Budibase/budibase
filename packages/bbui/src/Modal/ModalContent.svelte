<script context="module" lang="ts">
  export const keepOpen = Symbol("keepOpen")
</script>

<script lang="ts">
  import "@spectrum-css/dialog/dist/index-vars.css"
  import { getContext } from "svelte"
  import Button from "../Button/Button.svelte"
  import Divider from "../Divider/Divider.svelte"
  import Icon from "../Icon/Icon.svelte"
  import Context from "../context"
  import ProgressCircle from "../ProgressCircle/ProgressCircle.svelte"
  import { ModalCancelFrom } from "../constants"

  export let title: string | undefined = undefined
  export let size: "S" | "M" | "L" | "XL" = "S"
  export let cancelText: string = "Cancel"
  export let confirmText: string = "Confirm"
  export let showCancelButton: boolean = true
  export let showConfirmButton: boolean = true
  export let showCloseIcon: boolean = true
  export let onConfirm: (() => Promise<any> | any) | undefined = undefined
  export let onCancel: (() => Promise<any> | any) | undefined = undefined
  export let disabled: boolean = false
  export let showDivider: boolean = true

  export let showSecondaryButton: boolean = false
  export let secondaryButtonText: string | undefined = undefined
  export let secondaryAction: ((_e: Event) => Promise<any> | any) | undefined =
    undefined
  export let secondaryButtonWarning: boolean = false
  export let custom: boolean = false

  const { hide, cancel } = getContext(Context.Modal)

  let loading: boolean = false

  let confirmDisabled: boolean
  $: confirmDisabled = disabled || loading

  async function secondary(e: Event): Promise<void> {
    loading = true
    if (!secondaryAction || (await secondaryAction(e)) !== keepOpen) {
      hide()
    }
    loading = false
  }

  export async function confirm(): Promise<void> {
    loading = true
    if (!onConfirm || (await onConfirm()) !== keepOpen) {
      hide()
    }
    loading = false
  }

  async function close(): Promise<void> {
    loading = true
    if (!onCancel || (await onCancel()) !== keepOpen) {
      cancel(ModalCancelFrom.CANCEL_BUTTON)
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
              secondary
              warning={secondaryButtonWarning}
              on:click={secondary}>{secondaryButtonText}</Button
            >
          </div>
        {/if}

        {#if showCancelButton}
          <Button secondary on:click={close}>
            {cancelText}
          </Button>
        {/if}
        {#if showConfirmButton}
          <span class="confirm-wrap">
            <Button
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
        <Icon
          hoverable
          name="x"
          on:click={() => cancel(ModalCancelFrom.CLOSE_BUTTON)}
        />
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
  /* keep default small width from Spectrum; do not override here */

  .content-grid {
    display: grid;
    position: relative;
    gap: var(--spacing-xl);
  }

  /* For custom (no-grid) dialogs, stretch content and center children */
  .no-grid .spectrum-Dialog-content.content-grid {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: stretch;
    box-sizing: border-box;
  }

  /* Ensure inner container stretches to modal width */
  .modal-core {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    box-sizing: border-box;
  }

  .spectrum-Dialog-content {
    overflow: visible;
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
  }

  .no-grid .spectrum-Dialog-content {
    border-top: 2px solid var(--spectrum-global-color-gray-200);
    border-bottom: 2px solid var(--spectrum-global-color-gray-200);
  }

  .spectrum-Dialog-heading {
    font-size: 24px;
  }

  .spectrum-Dialog-heading,
  .spectrum-Dialog-buttonGroup {
    box-sizing: border-box;
    width: 100%;
  }

  .no-grid .spectrum-Dialog-heading {
    margin-top: 12px;
    margin-left: 12px;
  }

  .spectrum-Dialog.no-grid {
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
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
    overflow-x: hidden;
    box-sizing: border-box;
    width: 100%;
  }

  .confirm-wrap :global(.spectrum-Button-label) {
    display: contents;
  }

  /* Keep actions visible in mobile portrait and allow content to scroll */
  @media (max-width: 640px) {
    .spectrum-Dialog-content.content-grid {
      padding-bottom: 80px; /* ensure content isn't hidden behind sticky footer */
      overflow-x: hidden; /* prevent accidental horizontal scroll */
    }
    .spectrum-Dialog-buttonGroup {
      position: sticky;
      bottom: 0;
      background: var(--spectrum-global-color-gray-50);
      padding-top: 12px;
      padding-bottom: 12px;
      box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
      z-index: 1;
    }
  }

  /* no extra scaling breakpoints; rely on modal container width */
</style>

<script>
  /**
   * Confirmation is handled as a callback rather than an event to allow
   * handling the result - meaning a parent can prevent the modal closing.
   *
   * A show/hide API is exposed as part of the modal and also via context for
   * children inside the modal.
   * "show" and "hide" events are emitted as visibility changes.
   *
   * Modals are rendered at the top of the DOM tree.
   */
  import { createEventDispatcher, setContext } from "svelte"
  import { fade, fly } from "svelte/transition"
  import Portal from "svelte-portal"
  import { Button } from "@budibase/bbui"
  import { ContextKey } from "./context"
  const dispatch = createEventDispatcher()

  export let wide = false
  export let padded = true
  export let title = undefined
  export let cancelText = "Cancel"
  export let confirmText = "Confirm"
  export let showCancelButton = true
  export let showConfirmButton = true
  export let onConfirm = () => {}
  export let visible = false
  export let loading = false

  let confirmLoading = false
  $: disabled = loading || confirmLoading || $$restProps.disabled

  function show() {
    if (visible) {
      return
    }
    visible = true
    dispatch("show")
  }

  function hide() {
    if (!visible) {
      return
    }
    visible = false
    dispatch("hide")
  }

  async function confirm() {
    loading = true
    if (!onConfirm || (await onConfirm()) !== false) {
      hide()
    }
    loading = false
  }

  setContext(ContextKey, { show, hide })
</script>

{#if visible}
  <Portal target="#modal-container">
    <div
      class="overlay"
      on:click|self={hide}
      transition:fade={{ duration: 200 }}>
      <div
        class="scroll-wrapper"
        on:click|self={hide}
        transition:fly={{ y: 50 }}>
        <div class="content-wrapper" on:click|self={hide}>
          <div class="modal" class:wide class:padded>
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
                      {disabled}
                      on:click={confirm}>
                      {confirmText}
                    </Button>
                  {/if}
                </div>
              </footer>
            {/if}
            <i class="ri-close-line" on:click={hide} />
          </div>
        </div>
      </div>
    </div>
  </Portal>
{/if}

<style>
  .overlay {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.25);
  }

  .scroll-wrapper {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    max-height: 100%;
  }

  .content-wrapper {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    width: 0;
  }

  .modal {
    background-color: white;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    box-shadow: 0 0 2.4rem 1.5rem rgba(0, 0, 0, 0.15);
    position: relative;
    flex: 0 0 400px;
    margin: 2rem 0;
    border-radius: var(--border-radius-m);
    gap: var(--spacing-xl);
  }
  .modal.wide {
    flex: 0 0 600px;
  }
  .modal.padded {
    padding: var(--spacing-xl);
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

  i {
    position: absolute;
    top: var(--spacing-xl);
    right: var(--spacing-xl);
    color: var(--ink);
    font-size: var(--font-size-xl);
  }
  i:hover {
    color: var(--grey-6);
    cursor: pointer;
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

<script>
  import "@spectrum-css/modal/dist/index-vars.css"
  import "@spectrum-css/underlay/dist/index-vars.css"
  import { createEventDispatcher, setContext, tick, onMount } from "svelte"
  import { fade, fly } from "svelte/transition"
  import Portal from "svelte-portal"
  import Context from "../context"

  export let fixed = false
  export let inline = false
  export let disableCancel = false
  export let autoFocus = true
  export let zIndex = 1001

  const dispatch = createEventDispatcher()
  let visible = fixed || inline
  let modal

  $: dispatch(visible ? "show" : "hide")

  export function show() {
    if (visible) {
      return
    }
    visible = true
  }

  export function hide() {
    if (!visible || fixed || inline) {
      return
    }
    visible = false
  }

  export function toggle() {
    if (visible) {
      hide()
    } else {
      show()
    }
  }

  export function cancel() {
    if (!visible || disableCancel) {
      return
    }
    dispatch("cancel")
    hide()
  }

  function handleKey(e) {
    if (visible && e.key === "Escape") {
      cancel()
    }
  }

  async function focusModal(node) {
    if (!autoFocus) {
      return
    }
    await tick()

    // Try to focus first input
    const inputs = node.querySelectorAll("input")
    if (inputs?.length) {
      inputs[0].focus()
    }

    // Otherwise try to focus confirmation button
    else if (modal) {
      const confirm = modal.querySelector(".confirm-wrap .spectrum-Button")
      if (confirm) {
        confirm.focus()
      }
    }
  }

  setContext(Context.Modal, { show, hide, toggle, cancel })

  onMount(() => {
    document.addEventListener("keydown", handleKey)
    return () => {
      document.removeEventListener("keydown", handleKey)
    }
  })
</script>

{#if inline}
  {#if visible}
    <div use:focusModal bind:this={modal} class="spectrum-Modal inline is-open">
      <slot />
    </div>
  {/if}
{:else}
  <!--
    We cannot conditionally render the portal as this leads to a missing
    insertion point when using nested modals. Therefore we just conditionally
    render the content of the portal.
    It still breaks the modal animation, but its better than soft bricking the
    screen.
  -->
  <Portal target=".modal-container">
    {#if visible}
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div
        class="spectrum-Underlay is-open"
        on:mousedown|self={cancel}
        style="z-index:{zIndex || 999}"
      >
        <div
          class="background"
          in:fade={{ duration: 200 }}
          out:fade|local={{ duration: 200 }}
        />
        <div class="modal-wrapper" on:mousedown|self={cancel}>
          <div class="modal-inner-wrapper" on:mousedown|self={cancel}>
            <slot name="outside" />
            <div
              use:focusModal
              bind:this={modal}
              class="spectrum-Modal is-open"
              in:fly={{ y: 30, duration: 200 }}
              out:fly|local={{ y: 30, duration: 200 }}
            >
              <slot />
            </div>
          </div>
        </div>
      </div>
    {/if}
  </Portal>
{/if}

<style>
  .spectrum-Underlay {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    overflow: auto;
    overflow-x: hidden;
    background: transparent;
  }
  .background {
    background: var(--modal-background, rgba(0, 0, 0, 0.75));
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    opacity: 0.65;
    pointer-events: none;
  }

  .modal-wrapper {
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    -moz-box-pack: center;
    justify-content: center;
    align-items: flex-start;
    max-height: 100%;
  }
  .modal-inner-wrapper {
    padding: 40px;
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    -moz-box-pack: center;
    justify-content: center;
    align-items: flex-start;
    width: 0;
    position: relative;
  }

  .spectrum-Modal {
    border: 2px solid var(--spectrum-global-color-gray-200);
    overflow: visible;
    max-height: none;
    transform: none;
    --spectrum-dialog-confirm-border-radius: var(
      --spectrum-global-dimension-size-100
    );
    max-width: 100%;
  }
  :global(.spectrum--lightest .spectrum-Modal.inline) {
    border: var(--border-light);
  }
</style>

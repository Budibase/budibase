<script>
  import "@spectrum-css/modal/dist/index-vars.css"
  import "@spectrum-css/underlay/dist/index-vars.css"
  import { createEventDispatcher, setContext, tick } from "svelte"
  import { fade, fly } from "svelte/transition"
  import Portal from "svelte-portal"
  import Context from "../context"

  export let fixed = false
  export let inline = false

  const dispatch = createEventDispatcher()
  let visible = fixed || inline
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

  function handleKey(e) {
    if (visible && e.key === "Escape") {
      hide()
    }
  }

  async function focusFirstInput(node) {
    const inputs = node.querySelectorAll("input")
    if (inputs?.length) {
      await tick()
      inputs[0].focus()
    }
  }

  setContext(Context.Modal, { show, hide })
</script>

<svelte:window on:keydown={handleKey} />

<!-- These svelte if statements need to be defined like this. -->
<!-- The modal transitions do not work if nested inside more than one "if" -->
{#if visible && inline}
  <div use:focusFirstInput class="spectrum-Modal inline is-open">
    <slot />
  </div>
{:else if visible}
  <Portal target=".modal-container">
    <div
      class="spectrum-Underlay is-open"
      transition:fade|local={{ duration: 200 }}
      on:mousedown|self={hide}
    >
      <div class="modal-wrapper" on:mousedown|self={hide}>
        <div class="modal-inner-wrapper" on:mousedown|self={hide}>
          <div
            use:focusFirstInput
            class="spectrum-Modal is-open"
            transition:fly|local={{ y: 30, duration: 200 }}
          >
            <slot />
          </div>
        </div>
      </div>
    </div>
  </Portal>
{/if}

<style>
  .spectrum-Underlay {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    z-index: 999;
    overflow: auto;
    overflow-x: hidden;
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
    flex: 1 1 auto;
    display: flex;
    flex-direction: row;
    -moz-box-pack: center;
    justify-content: center;
    align-items: flex-start;
    width: 0;
  }

  .spectrum-Modal {
    background: var(--background);
    overflow: visible;
    max-height: none;
    margin: 40px 0;
    transform: none;
    --spectrum-dialog-confirm-border-radius: var(
      --spectrum-global-dimension-size-100
    );
  }
  :global(.spectrum--lightest .spectrum-Modal.inline) {
    border: var(--border-light);
  }
</style>

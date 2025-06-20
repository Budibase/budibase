<script lang="ts">
  import "@spectrum-css/modal/dist/index-vars.css"
  import "@spectrum-css/underlay/dist/index-vars.css"
  import { createEventDispatcher, setContext, tick, onMount } from "svelte"
  import { fade, fly } from "svelte/transition"
  import Portal from "svelte-portal"
  import Context from "../context"
  import { ModalCancelFrom } from "../constants"

  export let fixed: boolean = false
  export let inline: boolean = false
  export let disableCancel: boolean = false
  export let autoFocus: boolean = true
  export let zIndex: number = 1001

  // Ensure any popovers inside this modal are rendered inside this modal
  setContext(Context.PopoverRoot, ".spectrum-Modal")

  const dispatch = createEventDispatcher<{
    show: void
    hide: void
    cancel: ModalCancelFrom
  }>()
  let visible: boolean = fixed || inline
  let modal: HTMLElement | undefined

  $: dispatch(visible ? "show" : "hide")

  export function show(): void {
    if (visible) {
      return
    }
    visible = true
  }

  export function hide(): void {
    if (!visible || fixed || inline) {
      return
    }
    visible = false
  }

  export function toggle(): void {
    if (visible) {
      hide()
    } else {
      show()
    }
  }

  export function cancel(from: ModalCancelFrom): void {
    if (!visible || disableCancel) {
      return
    }
    dispatch("cancel", from)
    hide()
  }

  function handleKey(e: KeyboardEvent): void {
    if (visible && e.key === "Escape") {
      cancel(ModalCancelFrom.ESCAPE_KEY)
    }
  }

  function focusModal(node: HTMLElement): void {
    if (!autoFocus) return
    tick().then(() => {
      const inputs = node.querySelectorAll("input")
      if (inputs?.length) {
        inputs[0].focus()
      } else if (modal) {
        const confirm = modal.querySelector(".confirm-wrap .spectrum-Button")
        if (confirm) {
          ;(confirm as HTMLElement).focus()
        }
      }
    })
  }

  setContext(Context.Modal, {
    show,
    hide,
    toggle,
    cancel,
  } as {
    show: () => void
    hide: () => void
    toggle: () => void
    cancel: () => void
  })

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
  <div class="portal">
    <Portal target=".modal-container">
      {#if visible}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          class="spectrum-Underlay is-open"
          on:mousedown|self={() => cancel(ModalCancelFrom.OUTSIDE_CLICK)}
          style="z-index:{zIndex || 999}"
        >
          <div
            class="background"
            in:fade={{ duration: 200 }}
            out:fade|local={{ duration: 200 }}
          />
          <div
            class="modal-wrapper"
            on:mousedown|self={() => cancel(ModalCancelFrom.OUTSIDE_CLICK)}
          >
            <div
              class="modal-inner-wrapper"
              on:mousedown|self={() => cancel(ModalCancelFrom.OUTSIDE_CLICK)}
            >
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
  </div>
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

  .portal,
  .portal :global(> div) {
    display: contents;
  }
</style>

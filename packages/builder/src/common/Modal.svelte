<script>
  import UIkit from "uikit"
  import ActionButton from "../common/ActionButton.svelte"

  export let isOpen = false
  export let onClosed = () => {}
  export let id = ""

  let ukModal
  let listenerAdded = false

  $: {
    if (ukModal && !listenerAdded) {
      listenerAdded = true
      ukModal.addEventListener("hidden", onClosed)
    }

    if (ukModal) {
      if (isOpen) {
        UIkit.modal(ukModal).show()
      } else {
        UIkit.modal(ukModal).hide()
      }
    }
  }
</script>

<div bind:this={ukModal} uk-modal {id}>
  <div class="uk-modal-dialog uk-modal-body" uk-overflow-auto>
    {#if onClosed}
      <button class="uk-modal-close-default" type="button" uk-close />
    {/if}
    <slot />
  </div>
</div>

<style>
  .uk-modal-dialog {
    border-radius: 0.3rem;
    width: 60%;
    height: 80vh;
    display: flex;
    flex-direction: column;
  }
</style>

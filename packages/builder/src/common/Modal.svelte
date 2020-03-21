<script>
  import UIkit from "uikit"
  import ActionButton from "../common/ActionButton.svelte"

  export let isOpen = false
  export let onClosed
  export let id = ""
  export let title

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
  {#if isOpen}
    <div class="uk-modal-dialog" uk-overflow-auto>
      {#if title}
        <div class="uk-modal-header">
          <h4 class="budibase__title--4">{title}</h4>
        </div>
      {/if}
      <div class="uk-modal-body">
        {#if onClosed}
          <button class="uk-modal-close-default" type="button" uk-close />
        {/if}
        <slot />
      </div>
    </div>
  {/if}
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

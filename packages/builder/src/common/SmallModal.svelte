<script>
  import UIkit from "uikit"
  import ActionButton from "../common/ActionButton.svelte"

  export let isOpen = false
  export let onClosed = () => {}
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
  <div class="uk-modal-dialog" uk-overflow-auto>
    {#if title}
      <div class="title">
        <h4 class="budibase__title--2">{title}</h4>
      </div>
    {/if}
      <div class="body">
        <div class="content">
        {#if onClosed}
          <button class="uk-modal-close-default" type="button" uk-close />
        {/if}
        <slot />
      </div>
    </div>
  </div>
</div>

<style>

.title{
  margin: 30px 0px 30px 80px;
}

.budibase__title--2 {
  margin:0px;
}

.uk-modal-dialog {
  border-radius: 0.3rem;
  max-width: 700px;
  display: flex;
  flex-direction: column;
}

.body {
  background: #fafafa;
}

.content {
  margin: 40px 80px 40px 80px;
}
</style>

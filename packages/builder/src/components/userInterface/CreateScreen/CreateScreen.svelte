<script>
  import { store } from "builderStore"
  import { Modal, Spacer } from "@budibase/bbui"
  import ChooseTemplate from "./ChooseTemplate.svelte"
  import NoTemplate from "./NoTemplate.svelte"
  import { slide, fade } from "svelte/transition"

  export const show = () => {
    dialog.show()
  }

  let dialog
  let template
</script>

<Modal bind:this={dialog} minWidth="500px">
  <h2>New Screen</h2>
  <Spacer extraLarge />

  {#if template === 'none'}
    <div transition:slide={{ delay: 0, duration: 300 }}>
      <NoTemplate on:finished={dialog.hide} />
    </div>
  {:else}
    <div transition:fade={{ delay: 100, duration: 200 }}>
      <ChooseTemplate
        on:finished={dialog.hide}
        on:next={() => (template = 'none')} />
    </div>
  {/if}
</Modal>

<style>
  h2 {
    font-size: var(--font-size-xl);
    margin: 0;
    font-family: var(--font-sans);
    font-weight: 600;
  }

  .modal-footer {
    display: flex;
    justify-content: space-between;
  }
</style>

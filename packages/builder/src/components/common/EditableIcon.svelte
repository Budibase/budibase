<script>
  import { Icon, Modal } from "@budibase/bbui"
  import ChooseIconModal from "@/components/start/ChooseIconModal.svelte"

  export let name
  export let size = "M"
  export let app
  export let color
  export let autoSave = false
  export let disabled = false

  let modal
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="editable-icon">
  {#if !disabled}
    <div class="hover" on:click={modal.show}>
      <Icon name="Edit" {size} color="var(--spectrum-global-color-gray-600)" />
    </div>
    <div class="normal">
      <Icon name={name || "Apps"} {size} {color} />
    </div>
  {:else}
    <Icon {name} {size} {color} />
  {/if}
</div>

<Modal bind:this={modal}>
  <ChooseIconModal {name} {color} {app} {autoSave} on:change />
</Modal>

<style>
  .editable-icon {
    position: relative;
    display: flex;
    justify-content: flex-start;
  }
  .normal {
    display: block;
  }
  .hover {
    display: none;
    cursor: pointer;
  }
  .editable-icon:hover .normal {
    display: none;
  }
  .editable-icon:hover .hover {
    display: block;
  }
</style>

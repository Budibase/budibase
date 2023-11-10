<script>
  import { Icon, Modal } from "@budibase/bbui"
  import ChooseIconModal from "components/start/ChooseIconModal.svelte"

  export let name
  export let size = "M"
  export let app
  export let color
  export let autoSave = false

  let modal
</script>

<div class="editable-icon">
  <div class="hover" on:click={modal.show}>
    <Icon name="Edit" {size} color="var(--spectrum-global-color-gray-600)" />
  </div>
  <div class="normal">
    <Icon {name} {size} {color} />
  </div>
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

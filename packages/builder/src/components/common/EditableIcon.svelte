<script>
  import { Icon } from "@budibase/bbui"
  import ChooseIconModal from "components/start/ChooseIconModal.svelte"

  export let name
  export let size
  export let app

  let iconModal
</script>

<div class="editable-icon">
  <div
    class="edit-hover"
    on:click={() => {
      iconModal.show()
    }}
  >
    <Icon name={"Edit"} size={"L"} />
  </div>
  <div class="app-icon">
    <Icon {name} {size} />
  </div>
</div>
<ChooseIconModal {app} bind:this={iconModal} />

<style>
  .editable-icon:hover .app-icon {
    opacity: 0;
  }
  .editable-icon {
    position: relative;
  }
  .editable-icon:hover .edit-hover {
    opacity: 1;
  }
  .edit-hover {
    color: var(--spectrum-global-color-gray-600);
    cursor: pointer;
    z-index: 100;
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0;
    /* transition: opacity var(--spectrum-global-animation-duration-100) ease; */
  }
</style>

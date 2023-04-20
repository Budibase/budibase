<script>
  import { ActionButton, Modal } from "@budibase/bbui"
  import EditPluginModal from "./EditPluginModal.svelte"

  import { _ } from "../../../../../../lang/i18n"

  export let row

  let editPluginModal
</script>

<ActionButton size="S" on:click={editPluginModal.show}
  >{$_(
    "pages.builder.portal.plugins._components.EditPluginRenderer.Edit"
  )}</ActionButton
>

<Modal bind:this={editPluginModal}>
  <EditPluginModal plugin={row} />
</Modal>

<script>
  import { ActionButton } from "@budibase/bbui"
  import { store } from "builderStore"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte"

  export let componentInstance

  let confirmDialog
</script>

<div>
  <ActionButton secondary on:click={confirmDialog.show}>
    Eject block
  </ActionButton>
</div>
<ConfirmDialog
  bind:this={confirmDialog}
  title="Eject block"
  body="Ejecting a block breaks it down into multiple components. Are you sure you want to eject this block?"
  onOk={() =>
    store.actions.components.requestEjectBlock(componentInstance?._id)}
  okText="Eject block"
/>

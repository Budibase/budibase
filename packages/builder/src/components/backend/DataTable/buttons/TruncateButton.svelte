<script>
  import { ActionButton } from "@budibase/bbui"
  import ConfirmDialog from "components/common/ConfirmDialog.svelte";
  import { createEventDispatcher } from "svelte";

  export let disabled

  let modal
  let dispatch = createEventDispatcher();
</script>

<ActionButton icon="DataRemove" quiet on:click={modal.show} {disabled}>
  Truncate
</ActionButton>
<ConfirmDialog
  bind:this={modal}
  body={`Are you sure you wish to truncate the table? Your data will be deleted and this action cannot be undone.`}
  okText="Truncate table"
  title="Confirm Truncate"
  onOk={() => dispatch("truncate")}
/>

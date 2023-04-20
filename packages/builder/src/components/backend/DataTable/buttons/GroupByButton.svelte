<script>
  import { Modal, Button } from "@budibase/bbui"
  import GroupByModal from "../modals/GroupByModal.svelte"
  import { _ } from "../../../../../lang/i18n"

  export let view = {}

  let modal
</script>

<Button
  icon="Group"
  primary
  size="S"
  quiet
  active={!!view.groupBy}
  on:click={modal.show}
>
  {$_("components.backend.DataTable.buttons.GroupByButton.Group_by")}
</Button>
<Modal bind:this={modal}>
  <GroupByModal {view} />
</Modal>

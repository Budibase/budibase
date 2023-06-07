<script>
  import { Modal, Button } from "@budibase/bbui"
  import GroupByModal from "../modals/GroupByModal.svelte"

  export let view = {}

  let modal
</script>

<Button
  icon="Group"
  primary
  quiet
  active={!!view.groupBy}
  on:click={modal.show}
>
  Group by
</Button>
<Modal bind:this={modal}>
  <GroupByModal {view} />
</Modal>

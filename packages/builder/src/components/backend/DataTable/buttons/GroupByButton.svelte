<script>
  import { Modal, Button } from "@budibase/bbui"
  import GroupByModal from "../modals/GroupByModal.svelte"
  import { _ as t } from "svelte-i18n"

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
  { $t('group-by-0') }
</Button>
<Modal bind:this={modal}>
  <GroupByModal {view} />
</Modal>

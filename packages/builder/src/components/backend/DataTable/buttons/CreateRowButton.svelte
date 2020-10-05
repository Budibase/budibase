<script>
  import { TextButton as Button, Icon } from "@budibase/bbui"
  import CreateEditRecordModal from "../modals/CreateEditRecordModal.svelte"
  import { Modal } from "components/common/Modal"

  let modalVisible
</script>

<div>
  <Button text small on:click={() => (modalVisible = true)}>
    <Icon name="addrow" />
    Create New Row
  </Button>
</div>
{#if modalVisible}
  <CreateEditRecordModal bind:visible={modalVisible} />
{/if}

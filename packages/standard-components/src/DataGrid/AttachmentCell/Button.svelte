<script>
  import { createEventDispatcher } from "svelte"
  import { DropdownMenu, TextButton as Button, Icon } from "@budibase/bbui"
  import AttachmentList from "../../attachments/AttachmentList.svelte"
  //   import Modal from "./Modal.svelte"

  const dispatch = createEventDispatcher()

  let anchor
  let dropdown

  export let files
</script>

<AttachmentList {files} />
<!-- <div bind:this={anchor}>
  <Button text small on:click={dropdown.show}>
    <Icon name="edit" />
  </Button>
</div>
<DropdownMenu bind:this={dropdown} {anchor} align="left">
  <h5>Edit Attachment(s)</h5>
   <Modal
        {_bb}
        {table}
        onClosed={dropdown.hide}
        on:newRow={() => dispatch('newRow')} />
 </DropdownMenu> -->

<!-- <style>
  div {
    display: grid;
    grid-template-columns: auto auto;
    place-items: start center;
  }
  h5 {
    padding: var(--spacing-xl) 0 0 var(--spacing-xl);
    margin: 0;
    font-weight: 500;
  }
</style> -->

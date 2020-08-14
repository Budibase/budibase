<script>
  import { Popover, Button, Icon, Input, Select } from "@budibase/bbui"
  import { backendUiStore } from "builderStore"
  import CreateEditRecord from "../modals/CreateEditRecord.svelte"

  let anchor
  let dropdown

  let name

  function saveView() {
    backendUiStore.actions.views.save({
      name,
      modelId: $backendUiStore.selectedModel._id
    })
  }
</script>

<div bind:this={anchor}>
  <Button text small on:click={dropdown.show}>
    <Icon name="addrow" />
    Create New View
  </Button>
</div>
<Popover bind:this={dropdown} {anchor} align="left">
  <h5>Create View</h5>
  <div class="input-group-column">
    <Input placeholder="View Name" thin bind:value={name} />
  </div>
  <div class="button-group">
    <Button secondary on:click={dropdown.hide}>Cancel</Button>
    <Button primary on:click={saveView}>Save View</Button>
  </div>
</Popover>

<style>
  h5 {
    margin-bottom: var(--spacing-l);
    font-weight: 500;
  }
</style>

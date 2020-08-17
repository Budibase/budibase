<script>
  import { Popover, Button, Icon, Input, Select } from "@budibase/bbui"
  import { goto } from "@sveltech/routify"
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import CreateEditRecord from "../modals/CreateEditRecord.svelte"

  let anchor
  let dropdown

  let name
  let field

  $: fields = Object.keys($backendUiStore.selectedModel.schema).filter(key => {
    return $backendUiStore.selectedModel.schema[key].type === "number"
  })

  function saveView() {
    backendUiStore.actions.views.save({
      name,
      modelId: $backendUiStore.selectedModel._id,
      field
    })
    notifier.success(`View ${name} created`)
    dropdown.hide()
    $goto(`../../../view/${name}`)
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
    <Select thin secondary bind:value={field}>
      {#each fields as field}
        <option value={field}>{field}</option>
      {/each}
    </Select>
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

  .button-group {
    margin-top: var(--spacing-l);
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-s);
  }

  .input-group-column {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-s);
  }
</style>

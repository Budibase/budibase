<script>
  import { Button, Select } from "@budibase/bbui"
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import { FIELDS } from "constants/backend"

  export let view = {}
  export let onClosed

  $: viewTable = $backendUiStore.tables.find(
    ({ _id }) => _id === $backendUiStore.selectedView.tableId
  )
  $: fields =
    viewTable &&
    Object.entries(viewTable.schema)
      .filter(entry => entry[1].type !== FIELDS.LINK.type)
      .map(([key]) => key)

  function saveView() {
    backendUiStore.actions.views.save(view)
    notifier.success(`View ${view.name} saved.`)
    onClosed()
  }
</script>

<div class="actions">
  <h5>Group</h5>
  <div class="input-group-row">
    <p>By</p>
    <Select secondary thin bind:value={view.groupBy}>
      <option value="">Choose an option</option>
      {#each fields as field}
        <option value={field}>{field}</option>
      {/each}
    </Select>
  </div>
  <div class="footer">
    <Button secondary on:click={onClosed}>Cancel</Button>
    <Button primary on:click={saveView}>Save</Button>
  </div>
</div>

<style>
  .actions {
    display: grid;
    grid-gap: var(--spacing-xl);
  }

  h5 {
    margin: 0;
    font-weight: 500;
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-m);
  }

  .input-group-row {
    display: grid;
    grid-template-columns: 20px 1fr;
    gap: var(--spacing-s);
    align-items: center;
  }

  p {
    margin: 0;
    font-size: var(--font-size-xs);
  }
</style>

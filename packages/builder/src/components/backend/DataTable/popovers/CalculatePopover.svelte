<script>
  import { Button, Input, Select } from "@budibase/bbui"
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import analytics from "analytics"

  const CALCULATIONS = [
    {
      name: "Statistics",
      key: "stats",
    },
    {
      name: "Count",
      key: "count",
    },
    {
      name: "Sum",
      key: "sum",
    },
  ]

  export let view = {}
  export let onClosed

  $: viewTable = $backendUiStore.tables.find(
    ({ _id }) => _id === $backendUiStore.selectedView.tableId
  )
  $: fields =
    viewTable &&
    Object.keys(viewTable.schema).filter(
      field =>
        view.calculation === "count" ||
        viewTable.schema[field].type === "number"
    )

  function saveView() {
    backendUiStore.actions.views.save(view)
    notifier.success(`View ${view.name} saved.`)
    onClosed()
    analytics.captureEvent("Added View Calculate", { field: view.field })
  }
</script>

<div class="actions">
  <h5>Calculate</h5>
  <div class="input-group-row">
    <p>The</p>
    <Select secondary thin bind:value={view.calculation}>
      <option value={''}>Choose an option</option>
      {#each CALCULATIONS as calculation}
        <option value={calculation.key}>{calculation.name}</option>
      {/each}
    </Select>
    {#if view.calculation}
      <p>of</p>
      <Select secondary thin bind:value={view.field}>
        <option value={''}>You must choose an option</option>
        {#each fields as field}
          <option value={field}>{field}</option>
        {/each}
      </Select>
    {/if}
  </div>
  <div class="footer">
    <Button secondary on:click={onClosed}>Cancel</Button>
    <Button primary on:click={saveView} disabled={!view.field}>Save</Button>
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
    grid-template-columns: auto 1fr;
    gap: var(--spacing-s);
    align-items: center;
  }

  p {
    margin: 0;
    font-size: var(--font-size-xs);
  }
</style>

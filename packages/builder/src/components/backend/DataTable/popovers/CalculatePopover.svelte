<script>
  import { Button, Select, Label, notifications } from "@budibase/bbui"
  import { tables, views } from "stores/backend"
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

  $: viewTable = $tables.list.find(({ _id }) => _id === $views.selected.tableId)
  $: fields =
    viewTable &&
    Object.keys(viewTable.schema).filter(
      field =>
        view.calculation === "count" ||
        // don't want to perform calculations based on auto ID
        (viewTable.schema[field].type === "number" &&
          !viewTable.schema[field].autocolumn)
    )

  function saveView() {
    views.save(view)
    notifications.success(`View ${view.name} saved.`)
    onClosed()
    analytics.captureEvent("Added View Calculate", { field: view.field })
  }
</script>

<div class="actions">
  <h5>Calculate</h5>
  <div class="input-group-row">
    <Label>The</Label>
    <Select
      bind:value={view.calculation}
      options={CALCULATIONS}
      getOptionLabel={x => x.name}
      getOptionValue={x => x.key} />
    {#if view.calculation}
      <Label>Of</Label>
      <Select bind:value={view.field} options={fields} />
    {/if}
  </div>
  <div class="footer">
    <Button secondary on:click={onClosed}>Cancel</Button>
    <Button cta on:click={saveView} disabled={!view.field}>Save</Button>
  </div>
</div>

<style>
  .actions {
    width: 200px;
    display: grid;
    grid-gap: var(--spacing-xl);
    padding: var(--spacing-xl);
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
</style>

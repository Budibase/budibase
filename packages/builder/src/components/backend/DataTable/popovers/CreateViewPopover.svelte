<script>
  import { Button, Input, Select } from "@budibase/bbui"
  import { goto } from "@sveltech/routify"
  import { backendUiStore } from "builderStore"
  import { notifier } from "builderStore/store/notifications"
  import analytics from "analytics"

  export let onClosed

  let name
  let field

  $: fields = Object.keys($backendUiStore.selectedTable.schema).filter(key => {
    return $backendUiStore.selectedTable.schema[key].type === "number"
  })
  $: views = $backendUiStore.tables.flatMap(table =>
    Object.keys(table.views || {})
  )

  function saveView() {
    if (views.includes(name)) {
      notifier.danger(`View exists with name ${name}.`)
      return
    }
    backendUiStore.actions.views.save({
      name,
      tableId: $backendUiStore.selectedTable._id,
      field,
    })
    notifier.success(`View ${name} created`)
    onClosed()
    analytics.captureEvent("View Created", { name })
    $goto(`../../../view/${name}`)
  }
</script>

<div class="actions">
  <h5>Create View</h5>
  <Input label="View Name" thin bind:value={name} />
  <div class="footer">
    <Button secondary on:click={onClosed}>Cancel</Button>
    <Button primary on:click={saveView}>Save View</Button>
  </div>
</div>

<style>
  h5 {
    margin: 0;
    font-weight: 500;
  }

  .actions {
    display: grid;
    grid-gap: var(--spacing-xl);
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-m);
  }
</style>
